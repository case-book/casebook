package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseGroupRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseTemplateRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TestcaseService {

    private final TestcaseTemplateRepository testcaseTemplateRepository;

    private final TestcaseGroupRepository testcaseGroupRepository;

    private final ProjectRepository projectRepository;

    private final SessionUtil sessionUtil;


    public List<TestcaseTemplate> selectTestcaseTemplateItemList(Long projectId) {
        return testcaseTemplateRepository.findAllByProjectId(projectId);
    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public List<TestcaseTemplate> saveTestcaseTemplateItemList(String spaceCode, Long projectId, List<TestcaseTemplate> testcaseTemplates, Long userId) {

        testcaseTemplates.stream().filter((TestcaseTemplate::isDeleted)).forEach((testcaseTemplate -> {
            testcaseTemplateRepository.delete(testcaseTemplate);
        }));

        LocalDateTime now = LocalDateTime.now();
        testcaseTemplates.stream().filter((testcaseTemplate -> !testcaseTemplate.isDeleted())).forEach((testcaseTemplate -> {
            if (testcaseTemplate.getId() == null) {
                testcaseTemplate.setCreationDate(now);
                testcaseTemplate.setCreatedBy(userId);
            }

            testcaseTemplate.setLastUpdateDate(now);
            testcaseTemplate.setLastUpdatedBy(userId);
        }));


        testcaseTemplateRepository.saveAll(testcaseTemplates.stream().filter((testcaseTemplate -> !testcaseTemplate.isDeleted())).collect(Collectors.toList()));
        return testcaseTemplates;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroup createTestcaseGroupInfo(String spaceCode, Long projectId, TestcaseGroup testcaseGroup, Long userId) {

        if (testcaseGroup.getParentId() != null) {
            TestcaseGroup testcaseGroupExist = testcaseGroupRepository.findByIdAndProjectId(testcaseGroup.getParentId(), projectId).orElseThrow(() -> new ServiceException("testcase.parent.group.notExist"));
            testcaseGroup.setDepth(testcaseGroupExist.getDepth() + 1);
        } else {
            testcaseGroup.setDepth(0L);
        }

        List<TestcaseGroup> sameParentGroups = testcaseGroupRepository.findAllByProjectIdAndParentId(projectId, testcaseGroup.getParentId());
        testcaseGroup.setItemOrder(sameParentGroups.size());
        LocalDateTime now = LocalDateTime.now();
        testcaseGroup.setCreationDate(now);
        testcaseGroup.setLastUpdateDate(now);
        testcaseGroup.setCreatedBy(userId);
        testcaseGroup.setLastUpdatedBy(userId);

        testcaseGroupRepository.save(testcaseGroup);
        return testcaseGroup;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public Project updateProjectTestcaseGroupOrderInfo(String spaceCode, Long projectId, Long targetId, Long destinationId, boolean toChildren) {

        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        List<TestcaseGroup> testcaseGroups = project.getTestcaseGroups();

        TestcaseGroup targetGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(targetId))).findAny().orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseGroup destinationGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(destinationId))).findAny().orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (toChildren) {

            List<TestcaseGroup> sameChildList = testcaseGroups.stream().filter(testcaseGroup -> destinationGroup.getId().equals(testcaseGroup.getParentId())).sorted(Comparator.comparingInt(TestcaseGroup::getItemOrder)).collect(Collectors.toList());

            AtomicInteger inx = new AtomicInteger(1);
            sameChildList.forEach((testcaseGroup) -> {
                if (!testcaseGroup.getId().equals(targetGroup.getId())) {
                    testcaseGroup.setItemOrder(inx.getAndIncrement());
                }
            });

            targetGroup.setDepth(destinationGroup.getDepth() + 1);
            targetGroup.setParentId(destinationGroup.getId());
            targetGroup.setItemOrder(0);

        } else {
            List<TestcaseGroup> sameParentList = testcaseGroups.stream().filter(testcaseGroup -> (destinationGroup.getParentId() == null && testcaseGroup.getParentId() == null) || (destinationGroup.getParentId() != null && destinationGroup.getParentId().equals(testcaseGroup.getParentId()))).sorted(Comparator.comparingInt(TestcaseGroup::getItemOrder)).collect(Collectors.toList());

            AtomicInteger inx = new AtomicInteger(0);
            sameParentList.forEach((testcaseGroup) -> {

                if (!testcaseGroup.getId().equals(targetGroup.getId())) {
                    testcaseGroup.setItemOrder(inx.getAndIncrement());
                }

                if (destinationGroup.getId().equals(testcaseGroup.getId())) {
                    inx.getAndIncrement();
                }
            });

            targetGroup.setDepth(destinationGroup.getDepth());
            targetGroup.setParentId(destinationGroup.getParentId());
            targetGroup.setItemOrder(destinationGroup.getItemOrder() + 1);
        }

        project.setLastUpdateDate(LocalDateTime.now());
        project.setLastUpdatedBy(sessionUtil.getUserId(req));
        projectRepository.save(project);

        return project;
    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteTestcaseGroupInfo(String spaceCode, Long projectId, Long testcaseGroupId) {

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        List<TestcaseGroup> testcaseGroups = project.getTestcaseGroups();
        TestcaseGroup targetTestcaseGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(testcaseGroupId))).findAny().orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        long maxDepth = testcaseGroups.stream().mapToLong(TestcaseGroup::getDepth).max().orElse(0L);

        Map<Long, List<TestcaseGroup>> deletedTargets = new HashMap<>();
        List<TestcaseGroup> startDepthList = new ArrayList<>();
        startDepthList.add(targetTestcaseGroup);
        deletedTargets.put(targetTestcaseGroup.getDepth(), startDepthList);

        for (long i = targetTestcaseGroup.getDepth(); i <= maxDepth; i += 1) {
            List<TestcaseGroup> parentList = deletedTargets.get(i);
            long childrenDepth = i + 1;
            if (parentList != null) {
                parentList.stream().forEach((parentGroup -> {
                    List<TestcaseGroup> children = testcaseGroups.stream()
                            .filter((testcaseGroup -> testcaseGroup.getParentId() != null && testcaseGroup.getDepth().equals(childrenDepth) && parentGroup.getId().equals(testcaseGroup.getParentId()))).collect(Collectors.toList());
                    List<TestcaseGroup> currentList = deletedTargets.get(childrenDepth);
                    if (currentList == null) {
                        currentList = new ArrayList<>();
                    }
                    currentList.addAll(children);
                    deletedTargets.put(childrenDepth, currentList);
                }));
            }
        }

        List<Long> deleteGroupIds = new ArrayList<>();

        for (long depth : deletedTargets.keySet()) {
            List<TestcaseGroup> list = deletedTargets.get(depth);
            list.stream().forEach((testcaseGroup -> deleteGroupIds.add(testcaseGroup.getId())));
        }


        testcaseGroupRepository.deleteByIds(deleteGroupIds);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroup updateTestcaseGroupName(String spaceCode, Long projectId, Long groupId, String name) {
        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.setName(name);
        testcaseGroup.setLastUpdateDate(LocalDateTime.now());
        testcaseGroup.setLastUpdatedBy(sessionUtil.getUserId(req));
        testcaseGroupRepository.save(testcaseGroup);
        return testcaseGroup;
    }


}
