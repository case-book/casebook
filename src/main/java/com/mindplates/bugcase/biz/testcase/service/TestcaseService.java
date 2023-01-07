package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.testcase.dto.*;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseGroupRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseItemRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseTemplateRepository;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Paths;
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

    private final ProjectFileRepository projectFileRepository;
    private final ProjectRepository projectRepository;

    private final FileUtil fileUtil;

    private final MappingUtil mappingUtil;


    public List<TestcaseTemplateDTO> selectTestcaseTemplateItemList(Long projectId) {
        List<TestcaseTemplate> testcaseTemplates = testcaseTemplateRepository.findAllByProjectId(projectId);
        return mappingUtil.convert(testcaseTemplates, TestcaseTemplateDTO.class);
    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroupDTO createTestcaseGroupInfo(String spaceCode, Long projectId, TestcaseGroupDTO testcaseGroup) {

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

        TestcaseGroup result = testcaseGroupRepository.save(mappingUtil.convert(testcaseGroup, TestcaseGroup.class));
        projectRepository.save(project);
        return mappingUtil.convert(result, TestcaseGroupDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public ProjectDTO updateProjectTestcaseGroupOrderInfo(String spaceCode, Long projectId, Long targetId, Long destinationId, boolean toChildren) {

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

        return mappingUtil.convert(project, ProjectDTO.class);
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
        List<Long> deleteTestcaseIds = new ArrayList<>();

        for (long depth : deletedTargets.keySet()) {
            List<TestcaseGroup> list = deletedTargets.get(depth);
            list.stream().forEach((testcaseGroup -> deleteGroupIds.add(testcaseGroup.getId())));
            list.stream().forEach((testcaseGroup -> {
                testcaseGroup.getTestcases().forEach(testcase -> deleteTestcaseIds.add(testcase.getId()));
            }));
        }

        List<ProjectFile> files = projectFileRepository.findAllByProjectIdAndFileSourceTypeAndFileSourceIdIn(projectId, FileSourceTypeCode.TESTCASE, deleteTestcaseIds);

        projectFileRepository.deleteByProjectFileSourceIds(projectId, FileSourceTypeCode.TESTCASE, deleteTestcaseIds);
        testcaseItemRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseGroupRepository.deleteByIds(deleteGroupIds);

        files.forEach((projectFile -> {
            Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());
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

        List<ProjectFile> files = projectFileRepository.findAllByProjectIdAndFileSourceTypeAndFileSourceId(projectId, FileSourceTypeCode.TESTCASE, testcaseId);
        projectFileRepository.deleteByProjectFileSourceId(projectId, FileSourceTypeCode.TESTCASE, testcaseId);
        testcaseItemRepository.deleteByTestcaseId(testcaseId);
        testcaseRepository.deleteById(testcaseId);
        files.forEach((testcaseFile -> {
            Resource resource = fileUtil.loadFileIfExist(testcaseFile.getPath());
            try {
                if (resource != null) {
                    Files.deleteIfExists(Paths.get(resource.getFile().getAbsolutePath()));
                }
            } catch (Exception e) {
                // ignore
            }

        }));
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroupDTO updateTestcaseGroupName(String spaceCode, Long projectId, Long groupId, String name) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.setName(name);
        testcaseGroupRepository.save(testcaseGroup);
        return mappingUtil.convert(testcaseGroup, TestcaseGroupDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroupDTO updateTestcaseGroupInfo(String spaceCode, Long projectId, Long groupId, String name, String description) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.setName(name);
        testcaseGroup.setDescription(description);
        testcaseGroupRepository.save(testcaseGroup);
        return mappingUtil.convert(testcaseGroup, TestcaseGroupDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseDTO createTestcaseInfo(String spaceCode, Long projectId, TestcaseDTO testcase) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int testcaseSeq = project.getTestcaseSeq() + 1;
        project.setTestcaseSeq(testcaseSeq);
        testcase.setSeqId("TC" + testcaseSeq);
        testcase.setName(testcase.getName() + "-" + testcaseSeq);
        testcase.setProject(ProjectDTO.builder().id(projectId).build());

        TestcaseTemplate defaultTestcaseTemplate = testcaseTemplateRepository.findAllByProjectIdAndDefaultTemplateTrue(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "testcase.default.template.notExist"));
        testcase.setTestcaseTemplate(TestcaseTemplateDTO.builder().id(defaultTestcaseTemplate.getId()).build());
        testcase.setTesterType(defaultTestcaseTemplate.getDefaultTesterType());
        testcase.setTesterValue(defaultTestcaseTemplate.getDefaultTesterValue());

        List<TestcaseTemplateItem> hasDefaultValueTemplateItemList = defaultTestcaseTemplate.getTestcaseTemplateItems().stream().filter(testcaseTemplateItem -> StringUtils.isNotBlank(testcaseTemplateItem.getDefaultValue())).collect(Collectors.toList());

        List<TestcaseItemDTO> testcaseItems = hasDefaultValueTemplateItemList.stream().map((testcaseTemplateItem -> {

            TestcaseItemDTO testcaseItem = TestcaseItemDTO.builder()
                    .testcaseTemplateItem(TestcaseTemplateItemDTO.builder().id(testcaseTemplateItem.getId()).build())
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
        Testcase result = testcaseRepository.save(mappingUtil.convert(testcase, Testcase.class));
        return mappingUtil.convert(result, TestcaseDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateTestcaseTestcaseGroupInfo(String spaceCode, Long projectId, Long targetTestcaseId, Long destinationGroupId) {

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
    public TestcaseDTO updateTestcaseName(String spaceCode, Long projectId, Long testcaseId, String name) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setName(name);
        testcaseRepository.save(testcase);
        return mappingUtil.convert(testcase, TestcaseDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseDTO updateTestcaseNameAndDescription(String spaceCode, Long projectId, Long testcaseId, String name, String description) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setName(name);
        testcase.setDescription(description);
        testcaseRepository.save(testcase);
        return mappingUtil.convert(testcase, TestcaseDTO.class);
    }

    public TestcaseDTO selectTestcaseInfo(Long projectId, Long testcaseId) {
        Testcase testcase = testcaseRepository.findByIdAndProjectId(testcaseId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseDTO testcaseDTO = TestcaseDTO.builder()
                .id(testcase.getId())
                .seqId(testcase.getSeqId())
                .name(testcase.getName())
                .description(testcase.getDescription())
                .itemOrder(testcase.getItemOrder())
                .closed(testcase.getClosed())
                .testcaseGroup(TestcaseGroupDTO.builder().id(testcase.getTestcaseGroup().getId()).build())
                .testcaseTemplate(TestcaseTemplateDTO.builder().id(testcase.getTestcaseTemplate().getId()).build())
                .project(ProjectDTO.builder().id(testcase.getProject().getId()).build())
                .testerType(testcase.getTesterType())
                .testerValue(testcase.getTesterValue())
                .testcaseItems(testcase.getTestcaseItems().stream()
                        .map((testcaseItem -> TestcaseItemDTO.builder().
                                id(testcaseItem.getId())
                                .testcase(TestcaseDTO.builder().id(testcaseItem.getTestcase().getId()).build())
                                .value(testcaseItem.getValue())
                                .text(testcaseItem.getText())
                                .type(testcaseItem.getType())
                                .testcaseTemplateItem(TestcaseTemplateItemDTO.builder()
                                        .id(testcaseItem.getTestcaseTemplateItem().getId())
                                        .type(testcaseItem.getTestcaseTemplateItem().getType())
                                        .build())
                                .build()))
                        .collect(Collectors.toList()))
                .build();

        return testcaseDTO;
        //return mappingUtil.convert(testcase, TestcaseDTO.class);
    }

    public TestcaseGroupDTO selectTestcaseGroupInfo(Long projectId, Long testcaseId) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(testcaseId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return mappingUtil.convert(testcaseGroup, TestcaseGroupDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseDTO updateTestcaseInfo(String spaceCode, Long projectId, Testcase testcase) {
        Testcase org = testcaseRepository.findById(testcase.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setSeqId(org.getSeqId());
        testcaseRepository.save(testcase);
        return mappingUtil.convert(testcase, TestcaseDTO.class);

    }


}
