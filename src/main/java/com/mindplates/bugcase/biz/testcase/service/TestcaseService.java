package com.mindplates.bugcase.biz.testcase.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.ai.service.LlmService;
import com.mindplates.bugcase.biz.ai.service.OpenAIClientService;
import com.mindplates.bugcase.biz.ai.service.OpenAISimpleClientService;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
import com.mindplates.bugcase.biz.space.service.SpaceLlmPromptService;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseListDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseNameDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseGroupRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseItemRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseTemplateItemRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseTemplateRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseCommentRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseItemRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseRepository;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class TestcaseService {

    private final TestcaseTemplateRepository testcaseTemplateRepository;
    private final TestcaseTemplateItemRepository testcaseTemplateItemRepository;
    private final TestcaseGroupRepository testcaseGroupRepository;
    private final TestcaseRepository testcaseRepository;
    private final TestcaseItemRepository testcaseItemRepository;
    private final ProjectFileRepository projectFileRepository;
    private final ProjectRepository projectRepository;
    private final FileUtil fileUtil;
    private final TestrunTestcaseGroupRepository testrunTestcaseGroupRepository;
    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;
    private final TestrunTestcaseGroupTestcaseCommentRepository testrunTestcaseGroupTestcaseCommentRepository;
    private final TestrunTestcaseGroupTestcaseItemRepository testrunTestcaseGroupTestcaseItemRepository;
    private final TestcaseProjectReleaseRepository testcaseProjectReleaseRepository;
    private final ProjectReleaseRepository projectReleaseRepository;
    private final OpenAIClientService openAIClientService;
    private final OpenAISimpleClientService openAISimpleClientService;
    private final LlmService llmService;
    private final SpaceLlmPromptService spaceLlmPromptService;
    private final ProjectService projectService;
    private TestcaseCachedService testcaseCachedService;


    public List<TestcaseDTO> selectTestcaseItemListByCreationTime(Long projectId, LocalDateTime from, LocalDateTime to) {
        List<Testcase> testcases = testcaseRepository.findAllByProjectIdAndCreationDateBetween(projectId, from, to);
        return testcases.stream().map((TestcaseDTO::new)).collect(Collectors.toList());
    }

    public List<TestcaseDTO> selectTestcaseItemListByContentUpdateDate(Long projectId, LocalDateTime from, LocalDateTime to) {
        List<Testcase> testcases = testcaseRepository.findAllByProjectIdAndContentUpdateDateBetween(projectId, from, to);
        return testcases.stream().map((TestcaseDTO::new)).collect(Collectors.toList());
    }

    private void deleteFile(Resource resource) {
        try {
            if (resource != null) {
                Files.deleteIfExists(Paths.get(resource.getFile().getAbsolutePath()));
            }
        } catch (Exception e) {
            // ignore
        }
    }

    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    @Transactional
    public TestcaseGroupDTO createTestcaseGroupInfo(String spaceCode, Long projectId, TestcaseGroupDTO testcaseGroupDTO) {
        int groupSeq = projectService.increaseTestcaseGroupSeq(spaceCode, projectId);

        testcaseGroupDTO.setSeqId("G" + groupSeq);
        testcaseGroupDTO.setName(testcaseGroupDTO.getDefaultName(groupSeq));

        if (testcaseGroupDTO.getParentId() != null) {
            long depth = testcaseGroupRepository.findDepthByIdAndProjectId(testcaseGroupDTO.getParentId(), projectId).orElseThrow(() -> new ServiceException("error.testcase.parent.group.notExist"));
            testcaseGroupDTO.setDepth(depth + 1);
        } else {
            testcaseGroupDTO.setDepth(0L);
        }

        int sameParentGroupsCount = testcaseGroupRepository.countByProjectIdAndParentId(projectId, testcaseGroupDTO.getParentId());
        testcaseGroupDTO.setItemOrder(sameParentGroupsCount);

        TestcaseGroup entity = testcaseGroupDTO.toEntity();
        TestcaseGroup result = testcaseGroupRepository.save(entity);

        return new TestcaseGroupDTO(result);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public void updateProjectTestcaseGroupOrderInfo(String spaceCode, Long projectId, Long targetId, Long destinationId, boolean toChildren) {

        List<TestcaseGroupDTO> testcaseGroups = testcaseCachedService.selectTestcaseGroupList(projectId);

        TestcaseGroupDTO targetGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(targetId))).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseGroupDTO destinationGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(destinationId))).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (toChildren) {

            List<TestcaseGroupDTO> sameChildList = testcaseGroups.stream()
                .filter(testcaseGroup -> destinationGroup.getId().equals(testcaseGroup.getParentId()))
                .sorted(Comparator.comparingInt(TestcaseGroupDTO::getItemOrder)).collect(Collectors.toList());

            AtomicInteger inx = new AtomicInteger(1);
            sameChildList.forEach(testcaseGroup -> {
                if (!testcaseGroup.getId().equals(targetGroup.getId())) {
                    testcaseGroup.setItemOrder(inx.getAndIncrement());
                }
            });

            targetGroup.setDepth(destinationGroup.getDepth() + 1);
            targetGroup.setParentId(destinationGroup.getId());
            targetGroup.setItemOrder(0);

        } else {
            List<TestcaseGroupDTO> sameParentList = testcaseGroups.stream().filter(
                    testcaseGroup -> (destinationGroup.getParentId() == null && testcaseGroup.getParentId() == null) || (
                        destinationGroup.getParentId() != null && destinationGroup.getParentId().equals(testcaseGroup.getParentId()))
                )
                .sorted(Comparator.comparingInt(TestcaseGroupDTO::getItemOrder)).collect(Collectors.toList());

            AtomicInteger inx = new AtomicInteger(0);
            sameParentList.forEach(testcaseGroup -> {

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

        List<TestcaseGroup> targetTestcaseGroups = testcaseGroups.stream().map(TestcaseGroupDTO::toEntity).collect(Collectors.toList());
        testcaseGroupRepository.saveAll(targetTestcaseGroups);
    }


    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public void deleteTestcaseGroupInfo(String spaceCode, Long projectId, Long testcaseGroupId) {
        List<TestcaseGroupDTO> testcaseGroups = testcaseCachedService.selectTestcaseGroupList(projectId);

        TestcaseGroupDTO targetTestcaseGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(testcaseGroupId))).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        long maxDepth = testcaseGroups.stream().mapToLong(TestcaseGroupDTO::getDepth).max().orElse(0L);

        Map<Long, List<TestcaseGroupDTO>> deletedTargets = new HashMap<>();
        List<TestcaseGroupDTO> startDepthList = new ArrayList<>();
        startDepthList.add(targetTestcaseGroup);
        deletedTargets.put(targetTestcaseGroup.getDepth(), startDepthList);

        for (long i = targetTestcaseGroup.getDepth(); i <= maxDepth; i += 1) {
            List<TestcaseGroupDTO> parentList = deletedTargets.get(i);
            long childrenDepth = i + 1;
            if (parentList != null) {
                parentList.forEach((parentGroup -> {
                    List<TestcaseGroupDTO> children = testcaseGroups.stream()
                        .filter((testcaseGroup -> testcaseGroup.getParentId() != null && testcaseGroup.getDepth().equals(childrenDepth) && parentGroup.getId().equals(testcaseGroup.getParentId())))
                        .collect(Collectors.toList());
                    List<TestcaseGroupDTO> currentList = deletedTargets.get(childrenDepth);
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

        for (Entry<Long, List<TestcaseGroupDTO>> entry : deletedTargets.entrySet()) {
            List<TestcaseGroupDTO> list = entry.getValue();
            list.forEach(testcaseGroup -> deleteGroupIds.add(testcaseGroup.getId()));
            list.forEach(testcaseGroup -> testcaseGroup.getTestcases().forEach(testcase -> deleteTestcaseIds.add(testcase.getId())));
        }

        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testrunTestcaseGroupTestcaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testrunTestcaseGroupRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseItemRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseProjectReleaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseGroupRepository.deleteByIds(deleteGroupIds);

        projectFileRepository.deleteByProjectFileSourceIds(projectId, FileSourceTypeCode.TESTCASE, deleteTestcaseIds);
        List<ProjectFile> files = projectFileRepository.findAllByProjectIdAndFileSourceTypeAndFileSourceIdIn(projectId, FileSourceTypeCode.TESTCASE, deleteTestcaseIds);
        files.forEach((projectFile -> {
            Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());
            this.deleteFile(resource);
        }));
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
        @CacheEvict(key = "{#projectId, #testcaseId}", value = CacheConfig.PROJECT_TESTCASE),
    })
    public void deleteTestcaseInfo(String spaceCode, Long projectId, Long testcaseId) {

        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestcaseId(testcaseId);
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestcaseId(testcaseId);
        testrunTestcaseGroupTestcaseRepository.deleteByTestcaseId(testcaseId);
        testcaseItemRepository.deleteByTestcaseId(testcaseId);
        testcaseProjectReleaseRepository.deleteByTestcaseId(testcaseId);
        testcaseRepository.deleteById(testcaseId);

        List<ProjectFile> files = projectFileRepository.findAllByProjectIdAndFileSourceTypeAndFileSourceId(projectId, FileSourceTypeCode.TESTCASE, testcaseId);
        files.forEach((testcaseFile -> {
            Resource resource = fileUtil.loadFileIfExist(testcaseFile.getPath());
            this.deleteFile(resource);
        }));

        projectFileRepository.deleteByProjectFileSourceId(projectId, FileSourceTypeCode.TESTCASE, testcaseId);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public TestcaseGroupDTO updateTestcaseGroupName(String spaceCode, Long projectId, Long groupId, String name) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.setName(name);
        testcaseGroupRepository.save(testcaseGroup);
        return new TestcaseGroupDTO(testcaseGroup);
    }

    public TestcaseGroupDTO selectTestcaseGroupInfo(Long projectId, Long testcaseGroupId) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(testcaseGroupId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestcaseGroupDTO(testcaseGroup);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public TestcaseGroupDTO updateTestcaseGroupInfo(String spaceCode, Long projectId, Long groupId, TestcaseGroupDTO updateTestcaseGroup) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.update(updateTestcaseGroup);
        TestcaseGroup result = testcaseGroupRepository.save(testcaseGroup);
        return new TestcaseGroupDTO(result);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public TestcaseDTO createTestcaseInfo(String spaceCode, Long projectId, TestcaseDTO testcase) {

        int testcaseSeq = projectService.increaseTestcaseSeq(spaceCode, projectId);

        testcase.setSeqId("TC" + testcaseSeq);
        testcase.setName(testcase.getName() + "-" + testcaseSeq);

        TestcaseTemplate defaultTestcaseTemplate = testcaseTemplateRepository.findAllByProjectIdAndDefaultTemplateTrue(projectId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "error.testcase.default.template.notExist"));
        testcase.setTestcaseTemplate(TestcaseTemplateDTO.builder().id(defaultTestcaseTemplate.getId()).build());
        testcase.setTesterType(defaultTestcaseTemplate.getDefaultTesterType());
        testcase.setTesterValue(defaultTestcaseTemplate.getDefaultTesterValue());

        List<TestcaseTemplateItem> hasDefaultValueTemplateItemList = defaultTestcaseTemplate.getTestcaseTemplateItems().stream()
            .filter(testcaseTemplateItem -> StringUtils.isNotBlank(testcaseTemplateItem.getDefaultValue())).collect(Collectors.toList());

        List<TestcaseItemDTO> testcaseItems = hasDefaultValueTemplateItemList.stream().map((testcaseTemplateItem -> {

            TestcaseItemDTO testcaseItem = TestcaseItemDTO.builder()
                .testcaseTemplateItem(TestcaseTemplateItemDTO.builder().id(testcaseTemplateItem.getId()).build())
                .type(testcaseTemplateItem.getDefaultType())
                .testcase(testcase).build();

            if (TestcaseItemType.EDITOR.equals(testcaseTemplateItem.getType())) {
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

        Testcase result = testcaseRepository.save(testcase.toEntity());

        List<Long> targetReleases = projectReleaseRepository.findIdByProjectIdAndIsTargetTrue(projectId);
        if (!targetReleases.isEmpty()) {
            TestcaseProjectRelease testcaseProjectRelease = TestcaseProjectRelease
                .builder()
                .testcase(Testcase.builder().id(result.getId()).build())
                .projectRelease(ProjectRelease.builder().id(targetReleases.get(0)).build())
                .build();

            testcaseProjectReleaseRepository.save(testcaseProjectRelease);
        }
        return new TestcaseDTO(result);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public void updateTestcaseTestcaseGroupInfo(String spaceCode, Long projectId, Long targetTestcaseId, Long destinationGroupId) {
        Testcase targetTestcase = testcaseRepository.findById(targetTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        targetTestcase.setItemOrder(0);
        targetTestcase.setTestcaseGroup(TestcaseGroup.builder().id(destinationGroupId).build());
        testcaseRepository.increaseTestcaseItemOrderByTestcaseGroupId(destinationGroupId);
        testcaseRepository.save(targetTestcase);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public void updateTestcaseOrderInfo(String spaceCode, Long projectId, Long targetTestcaseId, Long destinationTestcaseId) {
        Integer destinationTestcaseItemOrder = testcaseRepository.findItemOrderByTestcaseId(destinationTestcaseId);
        Long destinationTestcaseGroupId = testcaseRepository.findTestcaseGroupIdByTestcaseId(destinationTestcaseId);
        testcaseRepository.increaseTestcaseItemOrderByTestcaseGroupIdAndItemOrder(destinationTestcaseGroupId, destinationTestcaseItemOrder);
        testcaseRepository.updateTestcaseGroupAndOrder(targetTestcaseId, destinationTestcaseGroupId, destinationTestcaseItemOrder + 1);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
        @CacheEvict(key = "{#projectId, #testcaseId}", value = CacheConfig.PROJECT_TESTCASE),
    })
    public TestcaseListDTO updateTestcaseName(String spaceCode, Long projectId, Long testcaseId, String name) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setName(name);
        testcaseRepository.save(testcase);
        return new TestcaseListDTO(testcase);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
        @CacheEvict(key = "{#projectId, #testcaseId}", value = CacheConfig.PROJECT_TESTCASE),
    })
    public TestcaseListDTO updateTestcaseNameAndDescription(String spaceCode, Long projectId, Long testcaseId, String name, String description) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setName(name);
        testcase.setDescription(description);
        testcaseRepository.save(testcase);
        return new TestcaseListDTO(testcase);
    }


    public List<TestcaseNameDTO> selectProjectTestcaseNameList(Long projectId) {
        List<Testcase> testcases = testcaseRepository.findNameByProjectId(projectId);
        return testcases.stream().map(TestcaseNameDTO::new).collect(Collectors.toList());
    }

    public List<TestcaseDTO> selectProjectTestcaseList(Long projectId) {
        List<Testcase> testcases = testcaseRepository.findByProjectId(projectId);
        return testcases.stream().map(testcase -> TestcaseDTO
            .builder()
            .id(testcase.getId())
            .seqId(testcase.getSeqId())
            .testcaseGroup(TestcaseGroupDTO.builder().id(testcase.getTestcaseGroup().getId()).build())
            .name(testcase.getName())
            .description(testcase.getDescription())
            .itemOrder(testcase.getItemOrder())
            .closed(testcase.getClosed())
            .testcaseTemplate(TestcaseTemplateDTO.builder().id(testcase.getTestcaseTemplate().getId()).build())
            .project(ProjectDTO.builder().id(testcase.getProject().getId()).build())
            .testerType(testcase.getTesterType())
            .testerValue(testcase.getTesterValue())
            .contentUpdateDate(testcase.getContentUpdateDate())
            .testcaseItems(testcase.getTestcaseItems().stream().map(TestcaseItemDTO::new).collect(Collectors.toList()))
            .build()).collect(Collectors.toList());
    }

    public List<TestcaseItemDTO> selectProjectTestcaseItemList(Long projectId) {
        List<TestcaseItem> testcaseItems = testcaseItemRepository.findByTestcaseProjectId(projectId);
        return testcaseItems.stream().map(testcaseItem -> TestcaseItemDTO
            .builder()
            .id(testcaseItem.getId())
            .testcaseTemplateItem(TestcaseTemplateItemDTO.builder().id(testcaseItem.getTestcaseTemplateItem().getId()).build())
            .testcase(TestcaseDTO.builder().id(testcaseItem.getTestcase().getId()).build())
            .type(testcaseItem.getType())
            .value(testcaseItem.getValue())
            .text(testcaseItem.getText())
            .build()).collect(Collectors.toList());

    }

    public List<TestcaseTemplateItemDTO> selectProjectTestcaseTemplateItemList(Long projectId) {
        List<TestcaseTemplateItem> testcaseTemplateItems = testcaseTemplateItemRepository.findByTestcaseTemplateProjectId(projectId);
        return testcaseTemplateItems.stream().map(TestcaseTemplateItemDTO::new).collect(Collectors.toList());
    }


    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
        @CacheEvict(key = "{#projectId, #testcase.id}", value = CacheConfig.PROJECT_TESTCASE),
    })
    public TestcaseDTO updateTestcaseInfo(String spaceCode, Long projectId, TestcaseDTO testcase) {
        Testcase target = testcaseRepository.findById(testcase.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        List<TestcaseProjectRelease> deletedTestcaseProjectReleaseList = target.update(testcase);

        // 목록에서 제거해도 TestcaseProjectRelease가 삭제된 것으로 인식되지 않아서, 삭제가 되지 않아서, 수동으로 업데이트 처리함 (복합 키 때문으로 추정되지만, 원인을 아직 모름)
        deletedTestcaseProjectReleaseList.forEach(testcaseProjectRelease -> {
            testcaseProjectReleaseRepository.deleteByTestcaseIdAndProjectReleaseId(testcaseProjectRelease.getTestcase().getId(), testcaseProjectRelease.getProjectRelease().getId());
        });
        deletedTestcaseProjectReleaseList.clear();

        Testcase result = testcaseRepository.save(target);

        return new TestcaseDTO(result);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
        @CacheEvict(key = "{#projectId, #testcaseItem.testcase.id}", value = CacheConfig.PROJECT_TESTCASE),
    })
    public TestcaseItemDTO updateTestcaseItem(String spaceCode, Long projectId, TestcaseItemDTO testcaseItem) {
        TestcaseItem target = testcaseItemRepository.findById(testcaseItem.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if ("text".equals(testcaseItem.getType())) {
            target.setText(testcaseItem.getText());
        } else if ("value".equals(testcaseItem.getType())) {
            target.setValue(testcaseItem.getValue());
        }

        testcaseItemRepository.save(target);
        return new TestcaseItemDTO(target);
    }

    public Long selectProjectTestcaseCount(String spaceCode, long projectId) {
        return testcaseRepository.countByProjectSpaceCodeAndProjectId(spaceCode, projectId);
    }

    public Long selectProjectTestcaseCount(Long spaceId, long projectId) {
        return testcaseRepository.countByProjectSpaceIdAndProjectId(spaceId, projectId);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public TestcaseGroupDTO copyTestcaseGroupInfo(String spaceCode, Long projectId, Long testcaseGroupId, String targetType, Long targetId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int testcaseSeq = project.getTestcaseSeq();
        int testcaseGroupSeq = project.getTestcaseGroupSeq() + 1;

        project.setTestcaseGroupSeq(testcaseGroupSeq);

        TestcaseGroup sourceTestcaseGroup = testcaseGroupRepository.findById(testcaseGroupId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseGroupDTO copiedTestcaseGroup = new TestcaseGroupDTO(sourceTestcaseGroup);
        copiedTestcaseGroup.setId(null);
        copiedTestcaseGroup.setSeqId("G" + testcaseGroupSeq);
        copiedTestcaseGroup.setName("COPY OF " + sourceTestcaseGroup.getName());

        if (copiedTestcaseGroup.getTestcases() != null) {
            for (TestcaseDTO testcase : copiedTestcaseGroup.getTestcases()) {
                testcaseSeq += 1;
                testcase.setId(null);
                testcase.setSeqId("TC" + testcaseSeq);
                testcase.setTestcaseGroup(copiedTestcaseGroup);
                if (testcase.getTestcaseItems() != null) {
                    for (TestcaseItemDTO testcaseItem : testcase.getTestcaseItems()) {
                        testcaseItem.setId(null);
                        testcaseItem.setTestcase(testcase);
                    }
                }
            }
        }

        project.setTestcaseSeq(testcaseSeq);

        TestcaseGroup targetTestcaseGroup = null;
        if (targetType.equals("case")) {
            Testcase targetTestcase = testcaseRepository.findById(targetId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
            targetTestcaseGroup = targetTestcase.getTestcaseGroup();
        } else {
            targetTestcaseGroup = testcaseGroupRepository.findById(targetId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        }

        copiedTestcaseGroup.setParentId(targetTestcaseGroup.getId());
        copiedTestcaseGroup.setDepth(targetTestcaseGroup.getDepth() + 1);
        Integer maxItemOrder = testcaseGroupRepository.selectParentTestcaseGroupMaxItemOrder(targetTestcaseGroup.getId());
        copiedTestcaseGroup.setItemOrder(maxItemOrder);

        projectRepository.save(project);
        TestcaseGroup target = copiedTestcaseGroup.toEntity();
        TestcaseGroup result = testcaseGroupRepository.save(target);
        return new TestcaseGroupDTO(result);

    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public TestcaseDTO copyTestcaseInfo(String spaceCode, Long projectId, Long testcaseId, String pasteTargetType, Long pasteTargetId) {

        int testcaseSeq = projectService.increaseTestcaseSeq(spaceCode, projectId);

        Testcase sourceTestcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseDTO copiedTestcase = new TestcaseDTO(sourceTestcase);
        copiedTestcase.setId(null);
        copiedTestcase.setSeqId("TC" + testcaseSeq);
        copiedTestcase.setName("COPY OF " + sourceTestcase.getName());

        if (pasteTargetType.equals("case")) {
            Integer pasteTargetTestcaseItemOrder = testcaseRepository.findItemOrderByTestcaseId(pasteTargetId);
            Long pasteTargetTestcaseGroupId = testcaseRepository.findTestcaseGroupIdByTestcaseId(pasteTargetId);
            testcaseRepository.increaseTestcaseItemOrderByTestcaseGroupIdAndItemOrder(pasteTargetTestcaseGroupId, pasteTargetTestcaseItemOrder);
            copiedTestcase.setTestcaseGroup(TestcaseGroupDTO.builder().id(pasteTargetTestcaseGroupId).build());
            copiedTestcase.setItemOrder(pasteTargetTestcaseItemOrder + 1);
        } else if (pasteTargetType.equals("group")) {
            int groupTestcaseCount = testcaseRepository.countByTestcaseGroupId(pasteTargetId);
            copiedTestcase.setTestcaseGroup(TestcaseGroupDTO.builder().id(pasteTargetId).build());
            copiedTestcase.setItemOrder(groupTestcaseCount);
        }

        if (copiedTestcase.getTestcaseItems() != null) {
            for (TestcaseItemDTO testcaseItem : copiedTestcase.getTestcaseItems()) {
                testcaseItem.setId(null);
                testcaseItem.setTestcase(copiedTestcase);
            }
        }

        Testcase result = testcaseRepository.save(copiedTestcase.toEntity());
        return new TestcaseDTO(result);
    }


    @Transactional
    public JsonNode createParaphraseTestcase(String spaceCode, long projectId, long testcaseId, long modelId) throws JsonProcessingException {

        boolean aiEnabled = projectRepository.findAiEnabledById(projectId);

        if (!aiEnabled) {
            throw new ServiceException(HttpStatus.FORBIDDEN, "error.project.ai.not.activated");
        }

        SpaceLlmPromptDTO activePrompt = spaceLlmPromptService.selectActivatedLlmPromptInfo(spaceCode);

        OpenAiDTO openAi = llmService.selectOpenAiInfo(modelId, spaceCode);
        OpenAiModelDTO openAiModel = openAi.getModels().stream().filter(model -> model.getId().equals(modelId)).findAny().orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseDTO testcase = testcaseCachedService.selectTestcaseInfo(projectId, testcaseId);
        return openAISimpleClientService.rephraseToTestCase(openAi, openAiModel, activePrompt, testcase, SessionUtil.getUserId());
    }



    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public void deleteByProjectId(String spaceCode, Long projectId) {
        testcaseItemRepository.deleteByProjectId(projectId);
        testcaseRepository.deleteByProjectId(projectId);
        testcaseGroupRepository.deleteByProjectId(projectId);
    }

    @Transactional
    @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public void deleteTestcaseByTestcaseTemplateId(Long projectId, long testcaseTemplateId) {
        testcaseProjectReleaseRepository.deleteByTestcaseTemplateId(testcaseTemplateId);
        testcaseItemRepository.deleteByTestcaseTemplateId(testcaseTemplateId);
        testcaseRepository.deleteByTestcaseTemplateId(testcaseTemplateId);
    }
}
