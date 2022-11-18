package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.testcase.entity.*;
import com.mindplates.bugcase.biz.testcase.repository.*;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TestcaseService {

    private final TestcaseTemplateRepository testcaseTemplateRepository;

    private final TestcaseGroupRepository testcaseGroupRepository;

    private final TestcaseRepository testcaseRepository;

    private final TestcaseItemRepository testcaseItemRepository;

    private final TestcaseTemplateItemRepository testcaseTemplateItemRepository;

    private final TestcaseItemFileRepository testcaseItemFileRepository;
    private final ProjectRepository projectRepository;

    private final TestcaseItemFileService testcaseItemFileService;

    private final SessionUtil sessionUtil;

    private final CacheManager cacheManager;


    public List<TestcaseTemplate> selectTestcaseTemplateItemList(Long projectId) {
        return testcaseTemplateRepository.findAllByProjectId(projectId);
    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroup createTestcaseGroupInfo(String spaceCode, Long projectId, TestcaseGroup testcaseGroup) {

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int groupSeq = project.getTestcaseGroupSeq() + 1;
        project.setTestcaseGroupSeq(groupSeq);
        testcaseGroup.setSeqId("G" + groupSeq);
        testcaseGroup.setName(testcaseGroup.getName() + "-" + groupSeq);

        if (testcaseGroup.getParentId() != null) {
            TestcaseGroup testcaseGroupExist = testcaseGroupRepository.findByIdAndProjectId(testcaseGroup.getParentId(), projectId).orElseThrow(() -> new ServiceException("testcase.parent.group.notExist"));
            testcaseGroup.setDepth(testcaseGroupExist.getDepth() + 1);
        } else {
            testcaseGroup.setDepth(0L);
        }

        List<TestcaseGroup> sameParentGroups = testcaseGroupRepository.findAllByProjectIdAndParentId(projectId, testcaseGroup.getParentId());
        testcaseGroup.setItemOrder(sameParentGroups.size());

        testcaseGroupRepository.save(testcaseGroup);
        projectRepository.save(project);
        return testcaseGroup;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public Project updateProjectTestcaseGroupOrderInfo(String spaceCode, Long projectId, Long targetId, Long destinationId, boolean toChildren) {

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
            List<TestcaseGroup> sameParentList = testcaseGroups.stream().filter(testcaseGroup -> (destinationGroup.getParentId() == null && testcaseGroup.getParentId() == null) || (destinationGroup.getParentId() != null && destinationGroup.getParentId().equals(testcaseGroup.getParentId())))
                    .sorted(Comparator.comparingInt(TestcaseGroup::getItemOrder)).collect(Collectors.toList());

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

        List<TestcaseItemFile> files = testcaseItemFileRepository.findAllByTestcaseTestcaseGroupIdIn(deleteGroupIds);

        testcaseItemFileRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseItemRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseGroupRepository.deleteByIds(deleteGroupIds);

        files.forEach((testcaseItemFile -> {
            Resource resource = testcaseItemFileService.loadFileAsResource(testcaseItemFile.getPath());
            try {
                Files.deleteIfExists(Paths.get(resource.getFile().getAbsolutePath()));
            } catch (Exception e) {
                // ignore
            }

        }));
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteTestcaseInfo(String spaceCode, Long projectId, Long testcaseId) {

        List<TestcaseItemFile> files = testcaseItemFileRepository.findAllByTestcaseId(testcaseId);
        testcaseItemFileRepository.deleteByTestcaseId(testcaseId);
        testcaseItemRepository.deleteByTestcaseId(testcaseId);
        testcaseRepository.deleteById(testcaseId);
        files.forEach((testcaseItemFile -> {
            Resource resource = testcaseItemFileService.loadFileAsResource(testcaseItemFile.getPath());
            try {
                Files.deleteIfExists(Paths.get(resource.getFile().getAbsolutePath()));
            } catch (Exception e) {
                // ignore
            }

        }));
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroup updateTestcaseGroupName(String spaceCode, Long projectId, Long groupId, String name) {
        Long userId = SessionUtil.getUserId();
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.setName(name);
        testcaseGroupRepository.save(testcaseGroup);
        return testcaseGroup;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public Testcase createTestcaseInfo(String spaceCode, Long projectId, Testcase testcase) {

        Long userId = SessionUtil.getUserId();

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int testcaseSeq = project.getTestcaseSeq() + 1;
        project.setTestcaseSeq(testcaseSeq);
        testcase.setSeqId("TC" + testcaseSeq);
        testcase.setName(testcase.getName() + "-" + testcaseSeq);
        testcase.setProject(Project.builder().id(projectId).build());

        TestcaseTemplate defaultTestcaseTemplate = testcaseTemplateRepository.findAllByProjectIdAndIsDefaultTrue(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "testcase.default.template.notExist"));
        testcase.setTestcaseTemplate(defaultTestcaseTemplate);

        List<TestcaseTemplateItem> hasDefaultValueTemplateItemList = defaultTestcaseTemplate.getTestcaseTemplateItems().stream().filter(testcaseTemplateItem -> StringUtils.isNotBlank(testcaseTemplateItem.getDefaultValue())).collect(Collectors.toList());

        List<TestcaseItem> testcaseItems = hasDefaultValueTemplateItemList.stream().map((testcaseTemplateItem -> {

            TestcaseItem testcaseItem = TestcaseItem.builder()
                    .testcaseTemplateItem(testcaseTemplateItem)
                    .type(testcaseTemplateItem.getDefaultType())
                    .testcase(testcase).build();

            if ("EDITOR".equals(testcaseTemplateItem.getType())) {
                testcaseItem.setText(testcaseTemplateItem.getDefaultValue());
            } else {
                testcaseItem.setValue(testcaseTemplateItem.getDefaultValue());
            }

            return testcaseItem;

        })).collect(Collectors.toList());

        testcase.setTestcaseItems(testcaseItems);

        Integer maxItemOrder = testcaseRepository.selectTestcaseGroupMaxItemOrder(testcase.getTestcaseGroup().getId());
        if (maxItemOrder == null) {
            maxItemOrder = 0;
        } else {
            maxItemOrder += 1;
        }

        testcase.setItemOrder(maxItemOrder);
        testcase.setClosed(false);

        projectRepository.save(project);
        testcaseRepository.save(testcase);
        return testcase;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateTestcaseTestcaseGroupInfo(String spaceCode, Long projectId, Long targetTestcaseId, Long destinationGroupId) {
        Long userId = SessionUtil.getUserId();
        LocalDateTime now = LocalDateTime.now();

        Testcase targetTestcase = testcaseRepository.findById(targetTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseGroup destinationTestcaseGroup = testcaseGroupRepository.findById(destinationGroupId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestcase.setItemOrder(0);
        targetTestcase.setTestcaseGroup(destinationTestcaseGroup);

        destinationTestcaseGroup.getTestcases().stream().forEach((testcase -> testcase.setItemOrder(testcase.getItemOrder() + 1)));

        testcaseGroupRepository.save(destinationTestcaseGroup);
        testcaseRepository.save(targetTestcase);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateTestcaseOrderInfo(String spaceCode, Long projectId, Long targetTestcaseId, Long destinationTestcaseId) {
        Testcase destinationTestcase = testcaseRepository.findById(destinationTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseGroup destinationTestcaseGroup = destinationTestcase.getTestcaseGroup();
        destinationTestcaseGroup.getTestcases().stream().forEach(testcase -> {
            if (testcase.getItemOrder() > destinationTestcase.getItemOrder()) {
                testcase.setItemOrder(testcase.getItemOrder() + 1);
            }
        });

        Testcase targetTestcase = testcaseRepository.findById(targetTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        targetTestcase.setTestcaseGroup(destinationTestcase.getTestcaseGroup());
        targetTestcase.setItemOrder(destinationTestcase.getItemOrder() + 1);

        testcaseGroupRepository.save(destinationTestcaseGroup);
        testcaseRepository.save(targetTestcase);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public Testcase updateTestcaseName(String spaceCode, Long projectId, Long testcaseId, String name) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setName(name);
        testcaseRepository.save(testcase);
        return testcase;
    }

    public Optional<Testcase> selectTestcaseInfo(Long projectId, Long testcaseId) {
        return testcaseRepository.findByIdAndProjectId(testcaseId, projectId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public Testcase updateTestcaseInfo(String spaceCode, Long projectId, Testcase testcase) {
        Testcase org = testcaseRepository.findById(testcase.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setSeqId(org.getSeqId());
        testcaseRepository.save(testcase);
        return testcase;

    }


}
