package com.mindplates.bugcase.biz.testcase.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.ai.service.LlmService;
import com.mindplates.bugcase.biz.ai.service.OpenAIClientService;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceLlmPrompt;
import com.mindplates.bugcase.biz.space.repository.SpaceLlmPromptRepository;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupWithTestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseSimpleDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectReleaseId;
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
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
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
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

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
    private final MappingUtil mappingUtil;
    private final TestrunTestcaseGroupRepository testrunTestcaseGroupRepository;
    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;
    private final TestrunTestcaseGroupTestcaseCommentRepository testrunTestcaseGroupTestcaseCommentRepository;
    private final TestrunTestcaseGroupTestcaseItemRepository testrunTestcaseGroupTestcaseItemRepository;
    private final UserRepository userRepository;
    private final TestcaseProjectReleaseRepository testcaseProjectReleaseRepository;
    private final ProjectReleaseRepository projectReleaseRepository;
    private final OpenAIClientService openAIClientService;
    private final LlmService llmService;
    private final SpaceLlmPromptRepository spaceLlmPromptRepository;

    public List<TestcaseGroupDTO> selectTestcaseGroupList(Long projectId) {
        List<TestcaseGroup> testcaseGroups = testcaseGroupRepository.findAllByProjectId(projectId);
        return testcaseGroups.stream().map((TestcaseGroupDTO::new)).collect(Collectors.toList());
    }

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

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroupWithTestcaseDTO createTestcaseGroupInfo(String spaceCode, Long projectId, TestcaseGroupDTO testcaseGroupDTO) {

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int groupSeq = project.getTestcaseGroupSeq() + 1;
        project.setTestcaseGroupSeq(groupSeq);
        testcaseGroupDTO.setSeqId("G" + groupSeq);
        testcaseGroupDTO.setName(testcaseGroupDTO.getName() + "-" + groupSeq);

        if (testcaseGroupDTO.getParentId() != null) {
            TestcaseGroup testcaseGroupExist = testcaseGroupRepository.findByIdAndProjectId(testcaseGroupDTO.getParentId(), projectId)
                .orElseThrow(() -> new ServiceException("testcase.parent.group.notExist"));
            testcaseGroupDTO.setDepth(testcaseGroupExist.getDepth() + 1);
        } else {
            testcaseGroupDTO.setDepth(0L);
        }

        List<TestcaseGroup> sameParentGroups = testcaseGroupRepository.findAllByProjectIdAndParentId(projectId, testcaseGroupDTO.getParentId());
        testcaseGroupDTO.setItemOrder(sameParentGroups.size());

        TestcaseGroup result = testcaseGroupRepository.save(mappingUtil.convert(testcaseGroupDTO, TestcaseGroup.class));
        projectRepository.save(project);
        return new TestcaseGroupWithTestcaseDTO(result);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateProjectTestcaseGroupOrderInfo(String spaceCode, Long projectId, Long targetId, Long destinationId, boolean toChildren) {

        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        List<TestcaseGroup> testcaseGroups = testcaseGroupRepository.findAllByProjectId(projectId);

        TestcaseGroup targetGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(targetId))).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseGroup destinationGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(destinationId))).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (toChildren) {

            List<TestcaseGroup> sameChildList = testcaseGroups.stream()
                .filter(testcaseGroup -> destinationGroup.getId().equals(testcaseGroup.getParentId()))
                .sorted(Comparator.comparingInt(TestcaseGroup::getItemOrder)).collect(Collectors.toList());

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
            List<TestcaseGroup> sameParentList = testcaseGroups.stream().filter(
                    testcaseGroup -> (destinationGroup.getParentId() == null && testcaseGroup.getParentId() == null) || (
                        destinationGroup.getParentId() != null && destinationGroup.getParentId().equals(testcaseGroup.getParentId()))
                )
                .sorted(Comparator.comparingInt(TestcaseGroup::getItemOrder)).collect(Collectors.toList());

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

        testcaseGroupRepository.saveAll(testcaseGroups);


    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteTestcaseGroupInfo(String spaceCode, Long projectId, Long testcaseGroupId) {
        List<TestcaseGroup> testcaseGroups = testcaseGroupRepository.findAllByProjectId(projectId);
        TestcaseGroup targetTestcaseGroup = testcaseGroups.stream().filter((testcaseGroup -> testcaseGroup.getId().equals(testcaseGroupId))).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
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
                        .filter((testcaseGroup -> testcaseGroup.getParentId() != null && testcaseGroup.getDepth().equals(childrenDepth) && parentGroup
                            .getId().equals(testcaseGroup.getParentId()))).collect(Collectors.toList());
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

        for (Entry<Long, List<TestcaseGroup>> entry : deletedTargets.entrySet()) {
            List<TestcaseGroup> list = entry.getValue();
            list.forEach(testcaseGroup -> deleteGroupIds.add(testcaseGroup.getId()));
            list.forEach(testcaseGroup -> testcaseGroup.getTestcases().forEach(testcase -> deleteTestcaseIds.add(testcase.getId())));
        }

        List<ProjectFile> files = projectFileRepository
            .findAllByProjectIdAndFileSourceTypeAndFileSourceIdIn(projectId, FileSourceTypeCode.TESTCASE, deleteTestcaseIds);

        projectFileRepository.deleteByProjectFileSourceIds(projectId, FileSourceTypeCode.TESTCASE, deleteTestcaseIds);
        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testrunTestcaseGroupTestcaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testrunTestcaseGroupRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseItemRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseProjectReleaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseRepository.deleteByTestcaseGroupIds(deleteGroupIds);
        testcaseGroupRepository.deleteByIds(deleteGroupIds);

        files.forEach((projectFile -> {
            Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());
            this.deleteFile(resource);
        }));
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteTestcaseInfo(String spaceCode, Long projectId, Long testcaseId) {

        List<ProjectFile> files = projectFileRepository
            .findAllByProjectIdAndFileSourceTypeAndFileSourceId(projectId, FileSourceTypeCode.TESTCASE, testcaseId);
        projectFileRepository.deleteByProjectFileSourceId(projectId, FileSourceTypeCode.TESTCASE, testcaseId);
        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestcaseId(testcaseId);
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestcaseId(testcaseId);
        testrunTestcaseGroupTestcaseRepository.deleteByTestcaseId(testcaseId);
        testcaseItemRepository.deleteByTestcaseId(testcaseId);
        testcaseProjectReleaseRepository.deleteByTestcaseId(testcaseId);
        testcaseRepository.deleteById(testcaseId);
        files.forEach((testcaseFile -> {
            Resource resource = fileUtil.loadFileIfExist(testcaseFile.getPath());
            this.deleteFile(resource);
        }));
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroupWithTestcaseDTO updateTestcaseGroupName(String spaceCode, Long projectId, Long groupId, String name) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.setName(name);
        testcaseGroupRepository.save(testcaseGroup);
        return new TestcaseGroupWithTestcaseDTO(testcaseGroup);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroupWithTestcaseDTO updateTestcaseGroupInfo(String spaceCode, Long projectId, Long groupId, String name, String description) {
        TestcaseGroup testcaseGroup = testcaseGroupRepository.findByIdAndProjectId(groupId, projectId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcaseGroup.setName(name);
        testcaseGroup.setDescription(description);
        testcaseGroupRepository.save(testcaseGroup);
        return new TestcaseGroupWithTestcaseDTO(testcaseGroup);
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

        TestcaseTemplate defaultTestcaseTemplate = testcaseTemplateRepository.findAllByProjectIdAndDefaultTemplateTrue(projectId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "testcase.default.template.notExist"));
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

        projectRepository.save(project);
        Testcase result = testcaseRepository.save(mappingUtil.convert(testcase, Testcase.class));

        List<ProjectRelease> targetReleases = projectReleaseRepository.findByProjectIdAndIsTargetTrue(projectId);
        if (targetReleases.size() > 0) {
            TestcaseProjectRelease testcaseProjectRelease = TestcaseProjectRelease
                .builder()
                .testcase(Testcase.builder().id(result.getId()).build())
                .projectRelease(targetReleases.get(0))
                .build();

            testcaseProjectReleaseRepository.save(testcaseProjectRelease);
        }
        return new TestcaseDTO(result);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateTestcaseTestcaseGroupInfo(String spaceCode, Long projectId, Long targetTestcaseId, Long destinationGroupId) {

        Testcase targetTestcase = testcaseRepository.findById(targetTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseGroup destinationTestcaseGroup = testcaseGroupRepository.findById(destinationGroupId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestcase.setItemOrder(0);
        targetTestcase.setTestcaseGroup(destinationTestcaseGroup);

        destinationTestcaseGroup.getTestcases().stream().forEach((testcase -> testcase.setItemOrder(testcase.getItemOrder() + 1)));

        testcaseGroupRepository.save(destinationTestcaseGroup);
        testcaseRepository.save(targetTestcase);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateTestcaseOrderInfo(String spaceCode, Long projectId, Long targetTestcaseId, Long destinationTestcaseId) {
        Testcase destinationTestcase = testcaseRepository.findById(destinationTestcaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
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
    public TestcaseSimpleDTO updateTestcaseName(String spaceCode, Long projectId, Long testcaseId, String name) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setName(name);
        testcaseRepository.save(testcase);
        return new TestcaseSimpleDTO(testcase);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseSimpleDTO updateTestcaseNameAndDescription(String spaceCode, Long projectId, Long testcaseId, String name, String description) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setName(name);
        testcase.setDescription(description);
        testcaseRepository.save(testcase);
        return new TestcaseSimpleDTO(testcase);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseSimpleDTO createTestcaseRelease(String spaceCode, Long projectId, Long testcaseId, Long releaseId) {
        Testcase testcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Optional<TestcaseProjectRelease> testcaseProjectRelease = testcaseProjectReleaseRepository.findById(
            TestcaseProjectReleaseId.builder().testcase(testcaseId).projectRelease(releaseId).build());
        if (!testcaseProjectRelease.isPresent()) {
            TestcaseProjectRelease newTestcaseProjectRelease = TestcaseProjectRelease
                .builder()
                .testcase(Testcase.builder().id(testcaseId).build())
                .projectRelease(ProjectRelease.builder().id(releaseId).build())
                .build();

            if (testcase.getTestcaseProjectReleases() == null) {
                testcase.setTestcaseProjectReleases(new ArrayList<>());
            }

            testcase.getTestcaseProjectReleases().add(newTestcaseProjectRelease);
            testcaseRepository.save(testcase);
        }

        return new TestcaseSimpleDTO(testcase);
    }

    public TestcaseDTO selectTestcaseInfo(Long projectId, Long testcaseId) {
        Testcase testcase = testcaseRepository.findByIdAndProjectId(testcaseId, projectId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        User createdUser = null;
        if (testcase.getCreatedBy() != null) {
            createdUser = userRepository.findById(testcase.getCreatedBy()).orElse(null);
        }
        User lastUpdatedUser = null;
        if (testcase.getLastUpdatedBy() != null) {
            lastUpdatedUser = userRepository.findById(testcase.getLastUpdatedBy()).orElse(null);
        }

        return new TestcaseDTO(testcase, createdUser, lastUpdatedUser);
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
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseDTO updateTestcaseInfo(String spaceCode, Long projectId, Testcase testcase) {
        Testcase org = testcaseRepository.findById(testcase.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testcase.setSeqId(org.getSeqId());
        testcase.setContentUpdateDate(LocalDateTime.now());

        org.getTestcaseProjectReleases()
            .stream()
            .filter((testcaseProjectRelease -> testcase.getTestcaseProjectReleases()
                .stream()
                .noneMatch(
                    testcaseProjectRelease1 -> testcaseProjectRelease1.getTestcase().getId().equals(testcaseProjectRelease.getTestcase().getId()) && testcaseProjectRelease1.getProjectRelease().getId()
                        .equals(testcaseProjectRelease.getProjectRelease().getId()))
            )).forEach(testcaseProjectRelease -> {
                testcaseProjectReleaseRepository.deleteByTestcaseIdAndProjectReleaseId(testcaseProjectRelease.getTestcase().getId(), testcaseProjectRelease.getProjectRelease().getId());
            });

        testcaseRepository.save(testcase);

        return new TestcaseDTO(testcase);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseItemDTO updateTestcaseItem(String spaceCode, Long projectId, TestcaseItem testcaseItem) {
        TestcaseItem org = testcaseItemRepository.findById(testcaseItem.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if ("text".equals(testcaseItem.getType())) {
            org.setText(testcaseItem.getText());
        } else if ("value".equals(testcaseItem.getType())) {
            org.setValue(testcaseItem.getValue());
        }

        testcaseItemRepository.save(org);
        return new TestcaseItemDTO(org);
    }

    public Long selectProjectTestcaseCount(String spaceCode, long projectId) {
        return testcaseRepository.countByProjectSpaceCodeAndProjectId(spaceCode, projectId);
    }

    public Long selectProjectTestcaseCount(Long spaceId, long projectId) {
        return testcaseRepository.countByProjectSpaceIdAndProjectId(spaceId, projectId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroupDTO copyTestcaseGroupInfo(String spaceCode, Long projectId, Long testcaseGroupId, String targetType, Long targetId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int testcaseSeq = project.getTestcaseSeq();
        int testcaseGroupSeq = project.getTestcaseGroupSeq() + 1;

        project.setTestcaseGroupSeq(testcaseGroupSeq);

        TestcaseGroup sourceTestcaseGroup = testcaseGroupRepository.findById(testcaseGroupId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
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
        TestcaseGroup result = testcaseGroupRepository.save(mappingUtil.convert(copiedTestcaseGroup, TestcaseGroup.class));
        return new TestcaseGroupDTO(result);

    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseDTO copyTestcaseInfo(String spaceCode, Long projectId, Long testcaseId, String targetType, Long targetId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int testcaseSeq = project.getTestcaseSeq() + 1;
        project.setTestcaseSeq(testcaseSeq);

        Testcase sourceTestcase = testcaseRepository.findById(testcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseDTO copiedTestcase = new TestcaseDTO(sourceTestcase);
        copiedTestcase.setId(null);
        copiedTestcase.setSeqId("TC" + testcaseSeq);
        copiedTestcase.setName("COPY OF " + sourceTestcase.getName());
        if (targetType.equals("case")) {
            Testcase targetTestcase = testcaseRepository.findById(targetId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
            copiedTestcase.setTestcaseGroup(TestcaseGroupDTO.builder().id(targetTestcase.getTestcaseGroup().getId()).build());
            copiedTestcase.setItemOrder(targetTestcase.getItemOrder() + 1);

            TestcaseGroup targetTestcaseGroup = targetTestcase.getTestcaseGroup();
            targetTestcaseGroup.getTestcases().stream().forEach(testcase -> {
                if (testcase.getItemOrder() >= copiedTestcase.getItemOrder()) {
                    testcase.setItemOrder(testcase.getItemOrder() + 1);
                }
            });
            testcaseGroupRepository.save(targetTestcaseGroup);
        } else if (targetType.equals("group")) {
            TestcaseGroup targetTestcaseGroup = testcaseGroupRepository.findById(targetId)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
            copiedTestcase.setTestcaseGroup(TestcaseGroupDTO.builder().id(targetTestcaseGroup.getId()).build());
            copiedTestcase.setItemOrder(targetTestcaseGroup.getTestcases().size() + 1);
        }

        if (copiedTestcase.getTestcaseItems() != null) {
            for (TestcaseItemDTO testcaseItem : copiedTestcase.getTestcaseItems()) {
                testcaseItem.setId(null);
                testcaseItem.setTestcase(copiedTestcase);
            }
        }
        projectRepository.save(project);
        Testcase result = testcaseRepository.save(mappingUtil.convert(copiedTestcase, Testcase.class));
        return new TestcaseDTO(result);
    }

    public SpaceLlmPromptDTO selectSpaceActiveLlmPrompt(String spaceCode) {
        SpaceLlmPrompt spaceLlmPrompt = spaceLlmPromptRepository.findBySpaceCodeAndActivatedTrue(spaceCode)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "error.project.llm.prompt.not.activated"));
        return spaceLlmPrompt == null ? null : new SpaceLlmPromptDTO(spaceLlmPrompt);
    }

    @Transactional
    public Mono<JsonNode> createParaphraseTestcase(String spaceCode, long projectId, long testcaseId, long modelId) throws JsonProcessingException {

        boolean aiEnabled = projectRepository.findAiEnabledById(projectId);

        if (!aiEnabled) {
            throw new ServiceException(HttpStatus.FORBIDDEN, "error.project.ai.not.activated");
        }

        SpaceLlmPromptDTO activePrompt = selectSpaceActiveLlmPrompt(spaceCode);

        OpenAiDTO openAi = llmService.selectOpenAiInfo(modelId, spaceCode);
        OpenAiModelDTO openAiModel = openAi.getModels().stream().filter(model -> model.getId().equals(modelId)).findAny().orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestcaseDTO testcase = this.selectTestcaseInfo(projectId, testcaseId);
        return openAIClientService.rephraseToTestCase(openAi, openAiModel, activePrompt, testcase, SessionUtil.getUserId());
    }


}
