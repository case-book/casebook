package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.entity.ProjectMessageChannel;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectMessageChannelRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.project.service.ProjectCachedService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileVariableDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceVariableDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import com.mindplates.bugcase.biz.space.service.SpaceProfileVariableService;
import com.mindplates.bugcase.biz.space.service.SpaceVariableService;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseItemRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseTemplateItemRepository;
import com.mindplates.bugcase.biz.testcase.service.TestcaseCachedService;
import com.mindplates.bugcase.biz.testrun.dto.TestrunCountSummaryDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunListDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunStatusDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseHistoryDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseIdTestrunIdDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseTesterDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseUserTestResultDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunMessageChannel;
import com.mindplates.bugcase.biz.testrun.entity.TestrunProfile;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import com.mindplates.bugcase.biz.testrun.repository.TestrunHookRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunMessageChannelRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunProfileRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseCommentRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseItemRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunUserRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.biz.user.service.UserCachedService;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.code.TesterChangeTargetCode;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.message.MessageSendService;
import com.mindplates.bugcase.common.message.vo.MessageData;
import com.mindplates.bugcase.common.service.MessageChannelService;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestrunService {


    private final TestrunRepository testrunRepository;
    private final TestcaseCachedService testcaseCachedService;
    private final ProjectService projectService;
    private final ProjectCachedService projectCachedService;
    private final TestrunTestcaseGroupRepository testrunTestcaseGroupRepository;
    private final TestrunUserRepository testrunUserRepository;
    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;
    private final TestrunTestcaseGroupTestcaseItemRepository testrunTestcaseGroupTestcaseItemRepository;
    private final TestrunTestcaseGroupTestcaseCommentRepository testrunTestcaseGroupTestcaseCommentRepository;
    private final ProjectFileRepository projectFileRepository;
    private final FileUtil fileUtil;
    private final MessageChannelService messageChannelService;
    private final MessageSendService messageSendService;
    private final ProjectRepository projectRepository;
    private final TestrunProfileRepository testrunProfileRepository;
    private final UserRepository userRepository;
    private final TestrunHookRepository testrunHookRepository;
    private final HttpRequestUtil httpRequestUtil;
    private final ProjectMessageChannelRepository projectMessageChannelRepository;
    private final TestrunMessageChannelRepository testrunMessageChannelRepository;
    private final MessageSourceAccessor messageSourceAccessor;
    private final TestrunCommentService testrunCommentService;
    private final TestrunReservationService testrunReservationService;
    private final TestrunIterationService testrunIterationService;
    private final TestcaseRepository testcaseRepository;
    private final TestcaseItemRepository testcaseItemRepository;
    private final TestcaseTemplateItemRepository testcaseTemplateItemRepository;
    private final SpaceProfileVariableService spaceProfileVariableService;
    private final SpaceVariableService spaceVariableService;
    private final UserCachedService userCachedService;
    private final CacheManager cacheManager;
    private final TestrunCachedService testrunCachedService;

    private final Random random = new Random();

    private void validateOpened(long testrunId) {
        boolean opened = testrunRepository.findOpenedById(testrunId);
        if (!opened) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "testrun.closed");
        }
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#testrunDTO.project.id}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#spaceCode,#testrunDTO.project.id}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#testrunDTO.project.id}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public TestrunDTO createTestrunInfo(String spaceCode, TestrunDTO testrunDTO) {

        long projectId = testrunDTO.getProject().getId();
        // 프로젝트 TESTRUN SEQ 증가
        int currentTestrunSeq = projectService.increaseTestrunSeq(spaceCode, testrunDTO.getProject().getId());
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        // 테스트런 정보 생성 및 카운트 초기 생성
        Testrun testrun = testrunDTO.toEntity(project);
        testrun.initializeCreateInfo(currentTestrunSeq);

        List<TestrunUser> testrunUsers = testrun.getTestrunUsers();
        if (!testrunUsers.isEmpty()) {
            // 프로젝트의 모든 테스트케이스 조회 및 정리
            List<Testcase> projectAllTestcases = testcaseRepository.findByProjectId(projectId);
            Map<Long, Testcase> projectTestcaseMap = new HashMap<>();
            projectAllTestcases.forEach(testcase -> projectTestcaseMap.put(testcase.getId(), testcase));

            // 프로젝트의 모든 테스트케이스 아이템 조회 및 정리
            List<TestcaseItem> projectAllTestcaseItems = testcaseItemRepository.findByTestcaseProjectId(projectId);
            Map<Long, List<TestcaseItem>> idTestcaseItemListMap = new HashMap<>();
            projectAllTestcaseItems.forEach(testcaseItem -> {
                if (!idTestcaseItemListMap.containsKey(testcaseItem.getTestcase().getId())) {
                    List<TestcaseItem> testcaseItemList = new ArrayList<>();
                    idTestcaseItemListMap.put(testcaseItem.getTestcase().getId(), testcaseItemList);
                }
                idTestcaseItemListMap.get(testcaseItem.getTestcase().getId()).add(testcaseItem);
            });

            // 프로젝트의 모든 테스트케이스 템플릿 아이템 조회 및 정리
            List<TestcaseTemplateItem> projectAllTestcaseTemplateItems = testcaseTemplateItemRepository.findByTestcaseTemplateProjectId(projectId);
            Map<Long, TestcaseTemplateItem> projectTestcaseTemplateItemMap = new HashMap<>();
            projectAllTestcaseTemplateItems.forEach(testcaseTemplateItem -> projectTestcaseTemplateItemMap.put(testcaseTemplateItem.getId(), testcaseTemplateItem));

            // 테스트케이스, 테스트케이스 아이템, 테스트케이스 템플릿으로 테스트런 테스트케이스 정보 초기화
            testrun.initializeTestGroupAndTestCase(projectTestcaseMap, idTestcaseItemListMap, projectTestcaseTemplateItemMap, random, testrunDTO.getAutoTestcaseNotAssignedTester());
        }

        // 시작 전 훅 호출
        testrun.getTestrunHookList(TestrunHookTiming.BEFORE_START).forEach(testrunHook -> {
            testrunHook.request(httpRequestUtil);
        });

        Testrun result = testrunRepository.save(testrun);

        if (result.getMessageChannels() != null) {
            List<ProjectUserDTO> testers = getTester(project, result.getTestcaseGroups());
            result.getMessageChannels().forEach(channel -> {
                ProjectMessageChannel projectMessageChannel = projectMessageChannelRepository.findById(channel.getMessageChannel().getId()).orElse(null);
                if (projectMessageChannel != null) {
                    SpaceMessageChannel messageChannel = projectMessageChannel.getMessageChannel();
                    SpaceMessageChannelDTO spaceMessageChannelDTO = new SpaceMessageChannelDTO(messageChannel);
                    messageChannelService.sendTestrunStartMessage(spaceMessageChannelDTO, spaceCode, result.getProject().getId(), result.getId(), result.getName(), testers);
                }
            });
        }

        return new TestrunDTO(result);
    }

    public List<TestrunListDTO> selectClosedProjectTestrunList(long projectId, LocalDateTime start, LocalDateTime end) {
        List<Testrun> list = testrunRepository.findProjectTestrunByOpenedAndRange(projectId, false, start, end);
        return list.stream().map(TestrunListDTO::new).collect(Collectors.toList());
    }

    public List<TestrunListDTO> selectLatestClosedTop3ProjectTestrunList(String spaceCode, long projectId) {
        Pageable pageable = PageRequest.of(0, 3);
        List<Testrun> list = testrunRepository.findTopNProjectTestrunByOpened(projectId, false, pageable);
        return list.stream().map(TestrunListDTO::new).collect(Collectors.toList());
    }

    public List<TestrunListDTO> selectOpenedTestrunList() {
        List<Testrun> list = testrunRepository.findAllByOpenedTrueAndEndDateTimeNotNull();
        return list.stream().map(TestrunListDTO::new).collect(Collectors.toList());
    }

    public List<TestrunTestcaseGroupTestcaseUserTestResultDTO> selectUntestedTestrunTestcaseGroupTestcaseList(Long testrunId) {
        List<TestrunTestcaseGroupTestcase> list = testrunTestcaseGroupTestcaseRepository.findAllByTestrunTestcaseGroupTestrunIdAndTestResult(testrunId, TestResultCode.UNTESTED);
        return list.stream().map(TestrunTestcaseGroupTestcaseUserTestResultDTO::new).collect(Collectors.toList());
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#testrunDTO.project.id}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#testrunDTO.project.id}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public TestrunListDTO updateTestrunInfo(String spaceCode, TestrunDTO testrunDTO) {

        Project project = projectRepository.findById(testrunDTO.getProject().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        Testrun updateTestrun = testrunDTO.toEntity();
        Testrun targetTestrun = testrunRepository.findById(testrunDTO.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestrun.update(testrunDTO);

        // 테스터 설정
        List<TestrunUser> testrunUsers = targetTestrun.getTestrunUsers();
        int currentSeq = -1;
        if (!testrunUsers.isEmpty()) {
            currentSeq = random.nextInt(testrunUsers.size());
        }

        if (!CollectionUtils.isEmpty(targetTestrun.getTestcaseGroups())) {
            for (TestrunTestcaseGroup testrunTestcaseGroup : targetTestrun.getTestcaseGroups()) {
                testrunTestcaseGroup.setTestrun(targetTestrun);
                if (testrunTestcaseGroup.getTestcases() != null) {
                    for (TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                        testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
                        TestcaseDTO testcase = testcaseCachedService.selectTestcaseInfo(updateTestrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId());
                        if (testrunTestcaseGroupTestcase.getId() == null) {
                            // 신규 생성된 테스트 케이스 그룹의 테스트케이스에 테스터 설정
                            currentSeq = testrunTestcaseGroupTestcase.assignTester(project, testcase, testrunUsers, currentSeq, random, targetTestrun.getAutoTestcaseNotAssignedTester());
                        } else {
                            // 존재하는 테스트케이스에 테스터가 삭제된 경우 신규 테스터 할당
                            currentSeq = testrunTestcaseGroupTestcase.reAssignTester(project, testcase, testrunUsers, currentSeq, random);

                        }
                    }
                }
            }
        }
        int totalTestCount = targetTestrun.calculateTotalTestcaseCount();
        targetTestrun.setTotalTestcaseCount(totalTestCount);
        Testrun result = testrunRepository.save(targetTestrun);
        return new TestrunListDTO(result);
    }

    // TODO 캐시 처리 필요 후보지만, 캐시 삭제가 너무 많아서 고민해봐야 함
    public TestrunDTO selectProjectTestrunInfo(long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunDTO(testrun, true);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public void deleteProjectTestrunInfo(String spaceCode, long projectId, long testrunId) {
        List<ProjectFile> files = projectFileRepository.findAllByProjectIdAndFileSourceTypeAndFileSourceId(projectId, FileSourceTypeCode.TESTRUN, testrunId);

        testrunMessageChannelRepository.deleteByTestrunId(testrunId);
        testrunHookRepository.deleteByTestrunId(testrunId);
        testrunProfileRepository.deleteByTestrunId(testrunId);
        testrunCommentService.deleteProjectTestrunComment(testrunId);
        testrunReservationService.updateTestrunReferenceNull(testrunId);
        projectFileRepository.deleteByProjectFileSourceId(projectId, FileSourceTypeCode.TESTRUN, testrunId);
        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupTestcaseRepository.deleteByTestrunId(testrunId);
        testrunUserRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupRepository.deleteByTestrunId(testrunId);
        testrunRepository.deleteById(testrunId);

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
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public TestrunDTO updateProjectTestrunStatusClosed(String spaceCode, long projectId, long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        TestrunCountSummaryDTO testrunCountSummary = testrunRepository.findTestrunCountSummary(testrunId);

        // 종료 전 훅 호출
        testrun.getTestrunHookList(TestrunHookTiming.BEFORE_END).forEach(testrunHookDTO -> {
            testrunHookDTO.request(httpRequestUtil);
        });

        validateOpened(testrunId);
        testrun.setOpened(false);
        testrun.setClosedDate(LocalDateTime.now());

        if (testrun.getMessageChannels() != null && !testrun.getMessageChannels().isEmpty()) {
            testrun.getMessageChannels().forEach(testrunMessageChannel -> {
                TestrunMessageChannelDTO messageChannel = new TestrunMessageChannelDTO(testrunMessageChannel);
                messageChannelService.sendTestrunClosedMessage(messageChannel.getMessageChannel().getMessageChannel(), spaceCode, testrunCountSummary);
            });
        }

        testrunRepository.save(testrun);

        return new TestrunDTO(testrun);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public void updateProjectTestrunStatusOpened(String spaceCode, long projectId, long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrun.setOpened(true);
        testrun.setClosedDate(null);

        LocalDateTime now = LocalDateTime.now();
        // testrun의 endDateTime이 지났을 경우, endDateTime을 현재 시간 + 1시간으로 변경
        if (testrun.getEndDateTime() != null && testrun.getEndDateTime().isBefore(now)) {
            testrun.setEndDateTime(now.plusHours(1));
        }

        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (testrun.getMessageChannels() != null && !testrun.getMessageChannels().isEmpty()) {
            List<ProjectUserDTO> testers = getTester(project, testrun.getTestcaseGroups());
            testrun.getMessageChannels().forEach(testrunMessageChannel -> {
                TestrunMessageChannelDTO messageChannel = new TestrunMessageChannelDTO(testrunMessageChannel);
                messageChannelService.sendTestrunReOpenMessage(messageChannel.getMessageChannel().getMessageChannel(), spaceCode, testrun.getProject().getId(), testrun.getId(), testrun.getName(),
                    testers);
            });
        }

        testrunRepository.save(testrun);
    }


    public TestrunTestcaseGroupTestcaseDTO selectTestrunTestcaseGroupTestcaseInfo(String spaceCode, long testrunId, long testrunTestcaseGroupTestcaseId) {

        List<TestrunProfile> testrunProfiles = testrunProfileRepository.findByTestrunId(testrunId);
        HashMap<String, String> variables = new HashMap<>();
        List<SpaceVariableDTO> spaceVariables = spaceVariableService.selectSpaceVariableList(spaceCode);
        List<SpaceProfileVariableDTO> spaceProfileVariables = spaceProfileVariableService.selectSpaceProfileVariableList(spaceCode);

        spaceVariables.forEach(spaceVariable -> {

            testrunProfiles.forEach(profile -> {
                Optional<SpaceProfileVariableDTO> spaceProfileVariableDTO = spaceProfileVariables
                    .stream()
                    .filter((spaceProfileVariable) -> spaceProfileVariable.getSpaceVariable().getId().equals(spaceVariable.getId()) && spaceProfileVariable.getSpaceProfile().getId()
                        .equals(profile.getProfile().getId())).findFirst();

                if (spaceProfileVariableDTO.isPresent() && spaceProfileVariableDTO.get().getValue() != null) {
                    variables.put(spaceVariable.getName(), spaceProfileVariableDTO.get().getValue());
                }
            });
        });

        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Testcase testcase = testrunTestcaseGroupTestcase.getTestcase();

        UserDTO createdUser = null;
        if (testcase.getCreatedBy() != null) {
            try {
                createdUser = userCachedService.getUserInfo(testcase.getCreatedBy());
            } catch (Exception e) {
                // ignore
            }
        }
        UserDTO lastUpdatedUser = null;
        if (testcase.getLastUpdatedBy() != null) {
            try {
                lastUpdatedUser = userCachedService.getUserInfo(testcase.getLastUpdatedBy());
            } catch (Exception e) {
                // ignore
            }
        }

        if (testcase.getName() != null && testcase.getName().contains("{{")) {
            variables.forEach((key, value) -> {
                testcase.setName(testcase.getName().replace("{{" + key + "}}", value));
            });
        }

        if (testcase.getDescription() != null && testcase.getDescription().contains("{{")) {
            variables.forEach((key, value) -> {
                testcase.setDescription(testcase.getDescription().replace("{{" + key + "}}", value));
            });
        }

        testcase.getTestcaseItems().forEach(testcaseItem -> {
            if (testcaseItem.getValue() != null && testcaseItem.getValue().contains("{{")) {
                variables.forEach((key, value) -> {
                    testcaseItem.setValue(testcaseItem.getValue().replace("{{" + key + "}}", value));
                });
            }

            if (testcaseItem.getText() != null && testcaseItem.getText().contains("{{")) {
                variables.forEach((key, value) -> {
                    testcaseItem.setText(testcaseItem.getText().replace("{{" + key + "}}", value));
                });
            }
        });

        TestrunTestcaseGroupTestcaseIdTestrunIdDTO testrunInfo = testrunRepository.findTestrunTestcaseGroupTestcaseId(testrunTestcaseGroupTestcase.getId());

        return new TestrunTestcaseGroupTestcaseDTO(testrunTestcaseGroupTestcase, createdUser, lastUpdatedUser, testrunInfo);
    }

    public List<TestrunTestcaseGroupTestcaseHistoryDTO> selectTestcaseTestrunResultHistory(String spaceCode, long projectId, long testcaseId, Long currentTestrunId, Integer pageNo) {
        Pageable pageInfo = PageRequest.of(Optional.ofNullable(pageNo).orElse(0), 10);
        List<TestrunTestcaseGroupTestcaseHistoryDTO> testrunTestcaseGroupTestcaseHistoryList = testrunTestcaseGroupTestcaseRepository.selectTopNTestrunTestcaseGroupTestcaseHistoryList(testcaseId,
            currentTestrunId, pageInfo);
        List<TestrunTestcaseGroupTestcaseIdTestrunIdDTO> testrunTestcaseGroupTestcaseIdsList = testrunRepository.findTestrunTestcaseGroupTestcaseIdsList(
            testrunTestcaseGroupTestcaseHistoryList.stream().map(TestrunTestcaseGroupTestcaseHistoryDTO::getId).collect(Collectors.toList()));

        testrunTestcaseGroupTestcaseHistoryList.forEach(testcaseGroupTestcaseHistory -> {
            testrunTestcaseGroupTestcaseIdsList.stream()
                .filter(testrunTestcaseGroupTestcaseIdTestrunIdDTO -> testrunTestcaseGroupTestcaseIdTestrunIdDTO.getTestrunTestcaseGroupTestcaseId().equals(testcaseGroupTestcaseHistory.getId()))
                .findAny().ifPresent(testrunInfo -> testcaseGroupTestcaseHistory.setTestrunSeqId(testrunInfo.getSeqId()));
        });

        return testrunTestcaseGroupTestcaseHistoryList;
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public TestrunTestcaseGroupTestcaseItemDTO updateTestrunTestcaseGroupTestcaseItem(String spaceCode, long projectId, long testrunId,
        TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItem) {
        validateOpened(testrunId);
        TestrunTestcaseGroupTestcaseItem target = testrunTestcaseGroupTestcaseItem.toEntity();
        TestrunTestcaseGroupTestcaseItem result = testrunTestcaseGroupTestcaseItemRepository.save(target);
        return new TestrunTestcaseGroupTestcaseItemDTO(result);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public boolean updateTestrunTestcaseResult(String spaceCode, long projectId, long testrunId, Long testrunTestcaseGroupTestcaseId, TestResultCode testResultCode) {
        validateOpened(testrunId);

        TestrunTestcaseGroupTestcase targetTestrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        TestrunCountSummaryDTO countSummary = testrunRepository.findTestrunCountSummary(testrunId);
        countSummary.updateCount(targetTestrunTestcaseGroupTestcase, testResultCode);
        testrunRepository.updateTestrunCountSummary(testrunId, countSummary.getPassedTestcaseCount(), countSummary.getFailedTestcaseCount(), countSummary.getUntestableTestcaseCount());
        targetTestrunTestcaseGroupTestcase.setTestResult(testResultCode);
        testrunTestcaseGroupTestcaseRepository.save(targetTestrunTestcaseGroupTestcase);

        MessageData participantData = MessageData.builder().type("TESTRUN-TESTCASE-RESULT-CHANGED").build();
        participantData.addData("testrunTestcaseGroupTestcaseId", testrunTestcaseGroupTestcaseId);
        participantData.addData("testResult", testResultCode);
        messageSendService.sendTo("projects/" + projectId + "/testruns/" + testrunId, participantData);

        MessageData testrunResultChangeData = MessageData.builder().type("TESTRUN-RESULT-CHANGED").build();
        testrunResultChangeData.addData("testrunId", testrunId);
        testrunResultChangeData.addData("testrunStatus", new TestrunStatusDTO(countSummary));
        messageSendService.sendTo("projects/" + projectId, testrunResultChangeData);

        if (countSummary.isDone()) {
            testrunRepository.updateTestrunOpened(testrunId, false);

            Cache projectCache = cacheManager.getCache(CacheConfig.PROJECT);
            if (projectCache != null) {
                projectCache.evictIfPresent(spaceCode + "," + projectId);
            }

            Cache projectOpenedSimpleTestrunsCache = cacheManager.getCache(CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS);
            if (projectOpenedSimpleTestrunsCache != null) {
                projectOpenedSimpleTestrunsCache.evictIfPresent(spaceCode + "," + projectId);
            }

            Cache projectOpenedDetailTestrunsCache = cacheManager.getCache(CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS);
            if (projectOpenedDetailTestrunsCache != null) {
                projectOpenedDetailTestrunsCache.evictIfPresent(spaceCode + "," + projectId);
            }

            List<TestrunMessageChannel> messageChannels = testrunMessageChannelRepository.findAllByTestrunId(testrunId);
            if (!messageChannels.isEmpty()) {
                messageChannels.forEach(testrunMessageChannel -> {
                    TestrunMessageChannelDTO messageChannel = new TestrunMessageChannelDTO(testrunMessageChannel);
                    messageChannelService.sendTestrunClosedMessage(messageChannel.getMessageChannel().getMessageChannel(), spaceCode, countSummary);
                });
            }
        }

        return countSummary.isDone();
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    })
    public void updateTestrunTestcaseResult(String spaceCode, long projectId, String projectToken, Long testrunSeqNumber, Long testcaseSeqNumber, TestResultCode resultCode, String comment) {
        long testrunId = testrunRepository.findTestrunIdByProjectIdAndSeqId(projectId, "R" + testrunSeqNumber)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"R" + testrunSeqNumber + " 테스트런"}));
        long testrunTestcaseGroupTestcaseId = testrunTestcaseGroupTestcaseRepository.findTestrunTestcaseGroupTestcaseIdByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(
            projectId, testrunId, "TC" + testcaseSeqNumber).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"TC" + testcaseSeqNumber + " 테스트케이스"}));
        updateTestrunTestcaseResult(spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId, resultCode);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS),
    })
    public void updateTestrunTestcaseTester(String spaceCode, long projectId, long testrunId, Long testrunTestcaseGroupTestcaseId, long testerId, long actorId) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Long beforeUserId = testrunTestcaseGroupTestcase.getTester() != null ? testrunTestcaseGroupTestcase.getTester().getId() : null;
        testrunTestcaseGroupTestcase.setTester(User.builder().id(testerId).build());

        User actor = userRepository.findById(actorId).orElse(null);
        String actorName;
        if (actor != null) {
            actorName = actor.getName();
        } else {
            actorName = "";
        }

        ProjectDTO project = projectCachedService.selectProjectInfo(spaceCode, projectId);
        String testrunName = testrunRepository.findNameById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        List<TestrunMessageChannel> testrunMessageChannels = testrunMessageChannelRepository.findAllByTestrunId(testrunId);
        if (!testrunMessageChannels.isEmpty()) {
            validateOpened(testrunId);
            String beforeUserName = project.getUsers().stream().filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(beforeUserId))
                .map(projectUserDTO -> projectUserDTO.getUser().getName()).findAny().orElse("");
            String afterUserName = project.getUsers().stream().filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(testerId)).map(projectUserDTO -> projectUserDTO.getUser().getName())
                .findAny().orElse("");

            testrunMessageChannels.forEach(testrunMessageChannel -> {
                TestrunMessageChannelDTO messageChannel = new TestrunMessageChannelDTO(testrunMessageChannel);
                messageChannelService.sendTestrunTesterChangeMessage(messageChannel.getMessageChannel().getMessageChannel(), spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId,
                    testrunName, testrunTestcaseGroupTestcase.getTestcase().getName(), beforeUserName, afterUserName, actorName);
            });
        }

        MessageData participantData = MessageData.builder().type("TESTRUN-TESTCASE-TESTER-CHANGED").build();
        participantData.addData("testrunTestcaseGroupTestcaseId", testrunTestcaseGroupTestcaseId);
        participantData.addData("testerId", testerId);
        messageSendService.sendTo("projects/" + projectId + "/testruns/" + testrunId, participantData);

        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS),
    })
    public void updateTestrunTestcaseTesterRandom(String spaceCode, long projectId, long testrunId, Long testerId, Long targetId, TesterChangeTargetCode target, String reason) {

        validateOpened(testrunId);

        String testrunName = testrunRepository.findNameById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        List<TestrunMessageChannel> testrunMessageChannels = testrunMessageChannelRepository.findAllByTestrunId(testrunId);

        List<Long> userIds = new ArrayList<>();
        List<TestrunUser> testrunUsers = testrunUserRepository.findByTestrunId(testrunId);
        testrunUsers.forEach((testrunUser -> {
            if (!testrunUser.getUser().getId().equals(testerId)) {
                userIds.add(testrunUser.getUser().getId());
            }
        }));

        if (userIds.isEmpty()) {
            throw new ServiceException("error.no.rest.tester");
        }

        ProjectDTO project = projectCachedService.selectProjectInfo(spaceCode, projectId);

        String beforeUserName = project.getUsers()
            .stream()
            .filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(testerId))
            .map(projectUserDTO -> projectUserDTO.getUser().getName())
            .findAny().orElse("");

        if (target.equals(TesterChangeTargetCode.ONE)) {
            int index = random.nextInt(userIds.size());
            TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(targetId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
            testrunTestcaseGroupTestcase.setTester(User.builder().id(userIds.get(index)).build());

            String afterUserName = project.getUsers().stream()
                .filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(userIds.get(index)))
                .map(projectUserDTO -> projectUserDTO.getUser().getName())
                .findAny().orElse("");

            if (!testrunMessageChannels.isEmpty()) {
                testrunMessageChannels.forEach(testrunMessageChannel -> {
                    TestrunMessageChannelDTO messageChannel = new TestrunMessageChannelDTO(testrunMessageChannel);
                    messageChannelService.sendTestrunTesterRandomChangeMessage(messageChannel.getMessageChannel().getMessageChannel(), spaceCode, projectId, testrunId, targetId, testrunName,
                        testrunTestcaseGroupTestcase.getTestcase().getName(), beforeUserName, afterUserName, reason);
                });
            }

            MessageData participantData = MessageData.builder().type("TESTRUN-TESTCASE-TESTER-CHANGED").build();
            participantData.addData("testrunTestcaseGroupTestcaseId", targetId);
            participantData.addData("testerId", userIds.get(index));
            messageSendService.sendTo("projects/" + projectId + "/testruns/" + testrunId, participantData);

            testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
        } else if (target.equals(TesterChangeTargetCode.ALL)) {

            List<TestrunTestcaseGroupTestcaseTesterDTO> targetTestcaseTesterList = testrunTestcaseGroupTestcaseRepository.findTestrunTestcaseGroupTestcaseByTesterId(testrunId, testerId);
            for (TestrunTestcaseGroupTestcaseTesterDTO testcase : targetTestcaseTesterList) {
                if (TestResultCode.UNTESTED.equals(testcase.getTestResult()) && ((testerId == null && testcase.getTesterId() == null) || (testcase.getTesterId() != null && testcase.getTesterId()
                    .equals(testerId)))) {
                    int index = random.nextInt(userIds.size());
                    long nextTesterId = userIds.get(index);
                    testrunTestcaseGroupTestcaseRepository.updateTesterById(testcase.getId(), nextTesterId);

                    String afterUserName = project.getUsers().stream()
                        .filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(nextTesterId))
                        .map(projectUserDTO -> projectUserDTO.getUser().getName())
                        .findAny().orElse("");

                    if (!testrunMessageChannels.isEmpty()) {
                        testrunMessageChannels.forEach(testrunMessageChannel -> {
                            TestrunMessageChannelDTO messageChannel = new TestrunMessageChannelDTO(testrunMessageChannel);
                            messageChannelService.sendTestrunTesterRandomChangeMessage(messageChannel.getMessageChannel().getMessageChannel(), spaceCode, projectId, testrunId, testcase.getId(),
                                testrunName, testcase.getTestcaseName(), beforeUserName, afterUserName, reason);
                        });
                    }

                    MessageData participantData = MessageData.builder().type("TESTRUN-TESTCASE-TESTER-CHANGED").build();
                    participantData.addData("testrunTestcaseGroupTestcaseId", testcase.getId());
                    participantData.addData("testerId", nextTesterId);
                    messageSendService.sendTo("projects/" + projectId + "/testruns/" + testrunId, participantData);
                }
            }

            testrunUserRepository.deleteByTestrunIdAndUserId(testrunId, testerId);
        }

    }

    public List<TestrunDTO> selectOpenedProjectTestrunList(String spaceCode, long projectId) {
        return testrunCachedService.selectOpenedProjectTestrunDetailList(spaceCode, projectId);
    }

    public List<TestrunDTO> selectUserAssignedTestrunList(String spaceCode, long projectId, Long userId) {
        List<TestrunDTO> projectOpenedTestruns = testrunCachedService.selectOpenedProjectTestrunDetailList(spaceCode, projectId);

        return projectOpenedTestruns
            .stream()
            .filter(testrun -> testrun.containsTester(userId))
            .peek(testrun -> {
                List<TestrunTestcaseGroupDTO> userTestcaseGroupList = testrun.getTestcaseGroups()
                    .stream()
                    .filter(
                        testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream()
                            .anyMatch((testrunTestcaseGroupTestcase -> userId
                                .equals(testrunTestcaseGroupTestcase.getTester() != null ? testrunTestcaseGroupTestcase.getTester().getId() : null))))
                    .peek((testrunTestcaseGroup -> {
                        List<TestrunTestcaseGroupTestcaseDTO> userTestcaseList = testrunTestcaseGroup.getTestcases().stream()
                            .filter((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester() != null ? testrunTestcaseGroupTestcase.getTester().getId() : null)))
                            .collect(Collectors.toList());
                        testrunTestcaseGroup.setTestcases(userTestcaseList);
                    })).collect(Collectors.toList());
                testrun.setTestcaseGroups(userTestcaseGroupList);
            })
            .collect(Collectors.toList());

    }

    public List<TestrunDTO> selectProjectTestrunHistoryList(String spaceCode, long projectId, LocalDateTime start, LocalDateTime end) {
        List<Testrun> list = testrunRepository.findAllByProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(projectId, start, end);
        return list.stream().map(testrun -> new TestrunDTO(testrun, false)).collect(Collectors.toList());
    }

    public void notifyTestrun(String spaceCode, Long projectId, Long testrunId) {
        LocalDateTime testrunEndDateTime = testrunRepository.findEndDateTimeById(testrunId).orElse(null);
        String testrunName = testrunRepository.findNameById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        List<TestrunMessageChannel> testrunMessageChannels = testrunMessageChannelRepository.findAllByTestrunId(testrunId);
        ProjectDTO project = projectCachedService.selectProjectInfo(spaceCode, projectId);

        // testrunEndDateTime과 현재 시간과의 시간 차이를 분으로 계산
        long diffMinutes = 0;
        if (testrunEndDateTime != null) {
            diffMinutes = Duration.between(LocalDateTime.now(), testrunEndDateTime).toMinutes();
        }

        if (!testrunMessageChannels.isEmpty()) {

            Map<Long, Integer> userRemainCount = new HashMap<>();
            List<TestrunTestcaseGroupTestcaseUserTestResultDTO> list = selectUntestedTestrunTestcaseGroupTestcaseList(testrunId);
            for (TestrunTestcaseGroupTestcaseUserTestResultDTO userTestResult : list) {
                Long testerId = userTestResult.getTester() != null ? userTestResult.getTester().getId() : null;
                if (userRemainCount.containsKey(testerId)) {
                    userRemainCount.put(testerId, userRemainCount.get(testerId) + 1);
                } else {
                    userRemainCount.put(testerId, 1);
                }

            }

            String message;
            if (diffMinutes > 0) {
                message = messageSourceAccessor.getMessage("testrun.m.left", new Object[]{testrunName, diffMinutes});
            } else {
                message = messageSourceAccessor.getMessage("testrun.remain.info", new Object[]{testrunName});
            }

            testrunMessageChannels.forEach(testrunMessageChannel -> {
                TestrunMessageChannelDTO messageChannel = new TestrunMessageChannelDTO(testrunMessageChannel);
                messageChannelService.sendTestrunRemainInfo(
                    messageChannel.getMessageChannel().getMessageChannel(), spaceCode, projectId,
                    message, testrunId, testrunName, project.getUsers(), userRemainCount);
            });
        }


    }

    @Transactional
    public TestrunHookDTO updateTestrunHookResult(TestrunHookDTO testrunHook) {
        return new TestrunHookDTO(testrunHookRepository.save(testrunHook.toEntity()));
    }

    public List<TestrunDTO> selectToBeClosedTestrunList(LocalDateTime endDateTime) {
        List<Testrun> list = testrunRepository.findToBeClosedTestrunList(endDateTime);
        return list.stream().map((TestrunDTO::new)).collect(Collectors.toList());
    }

    public List<TestrunMessageChannelDTO> selectTestrunMessageChannelList(long testrunId) {
        List<TestrunMessageChannel> testrunMessageChannels = testrunMessageChannelRepository.findAllByTestrunId(testrunId);
        return testrunMessageChannels.stream().map(TestrunMessageChannelDTO::new).collect(Collectors.toList());
    }

    public List<Long> selectTestcaseIncludeTestrunList(String projectToken, Long testcaseSeqNumber) {
        Long projectId = projectService.selectProjectId(projectToken);
        return testrunRepository.findTestrunSeqNoByProjectIdAndTestcaseSeqId(projectId, "TC" + testcaseSeqNumber);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS),
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS),

    })
    public void deleteProjectTestrun(String spaceCode, long projectId) {
        testrunMessageChannelRepository.deleteByProjectId(projectId);
        testrunHookRepository.deleteByProjectId(projectId);
        testrunProfileRepository.deleteByProjectId(projectId);
        testrunCommentService.deleteProjectComment(projectId);
        testrunTestcaseGroupTestcaseCommentRepository.deleteByProjectId(projectId);
        testrunTestcaseGroupTestcaseItemRepository.deleteByProjectId(projectId);
        testrunTestcaseGroupTestcaseRepository.deleteByProjectId(projectId);
        testrunUserRepository.deleteByProjectId(projectId);
        testrunTestcaseGroupRepository.deleteByProjectId(projectId);
        testrunReservationService.deleteByProjectId(projectId);
        testrunIterationService.deleteByProjectId(projectId);
        testrunRepository.deleteByProjectId(projectId);
    }

    @Transactional
    public void deleteTestrunGroupByTestcaseTemplateId(String spaceCode, long projectId, long testcaseTemplateId) {
        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestcaseTemplateId(testcaseTemplateId);
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestcaseTemplateId(testcaseTemplateId);
        testrunTestcaseGroupTestcaseRepository.deleteByTestcaseTemplateId(testcaseTemplateId);
    }

    @Transactional
    public void deleteTestrunByUserId(long userId) {
        testrunTestcaseGroupTestcaseCommentRepository.deleteByUserId(userId);
        testrunCommentService.deleteUserTestrunComment(userId);
        testrunTestcaseGroupTestcaseRepository.updateTesterNullByUserId(userId);
        testrunUserRepository.deleteByUserId(userId);
    }

    @Transactional
    public void deleteProjectTestrunUser(String spaceCode, long projectId, long userId) {
        testrunCommentService.deleteProjectTestrunUserComment(projectId, userId);
        testrunTestcaseGroupTestcaseCommentRepository.updateProjectTestrunTestcaseGroupTestcaseCommentUserNullByUserId(projectId, userId);
        testrunTestcaseGroupTestcaseRepository.updateProjectTesterNullByUserId(projectId, userId);
        testrunUserRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    @Transactional
    public void deleteTestrunMessageChannel(String spaceCode, long projectId, List<Long> messageChannelIds) {
        if (messageChannelIds != null && !messageChannelIds.isEmpty()) {
            messageChannelIds.forEach((testrunMessageChannelRepository::deleteByProjectMessageChannelId));
        }
    }

    private List<ProjectUserDTO> getTester(Project project, List<TestrunTestcaseGroup> testcaseGroups) {
        return testcaseGroups.stream().flatMap(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream())
            .filter(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.getTester() != null)
            .map(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.getTester().getId())
            .distinct()
            .map(userId -> {
                ProjectUser projectUser = project.getUsers().stream().filter((projectUserDTO -> projectUserDTO.getUser().getId().equals(userId))).findAny().orElse(null);
                return ProjectUserDTO.builder().id(projectUser.getId()).role(projectUser.getRole())
                    .user(UserDTO.builder().id(projectUser.getUser().getId()).name(projectUser.getUser().getName()).build())
                    .project(ProjectDTO.builder().id(projectUser.getProject().getId()).build())
                    .tags(projectUser.getTags()).build();

            }).collect(Collectors.toList());
    }


}
