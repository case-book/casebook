package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.dto.TestrunCommentDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunIterationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunParticipantDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunReservationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunStatusDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseCommentDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunComment;
import com.mindplates.bugcase.biz.testrun.entity.TestrunHook;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunParticipant;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import com.mindplates.bugcase.biz.testrun.repository.TestrunCommentRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunHookRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunIterationRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunParticipantRedisRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunProfileRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunReservationRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseCommentRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseItemRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunUserRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.code.TesterChangeTargetCode;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.message.MessageSendService;
import com.mindplates.bugcase.common.message.vo.MessageData;
import com.mindplates.bugcase.common.service.SlackService;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.TestrunHookResult;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.nio.file.Files;
import java.nio.file.Paths;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestrunService {

    private final TestrunParticipantRedisRepository testrunParticipantRedisRepository;
    private final TestrunRepository testrunRepository;
    private final TestrunReservationRepository testrunReservationRepository;
    private final TestrunIterationRepository testrunIterationRepository;
    private final TestcaseService testcaseService;
    private final ProjectService projectService;
    private final TestrunTestcaseGroupRepository testrunTestcaseGroupRepository;
    private final TestrunUserRepository testrunUserRepository;
    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;
    private final TestrunTestcaseGroupTestcaseItemRepository testrunTestcaseGroupTestcaseItemRepository;
    private final TestrunTestcaseGroupTestcaseCommentRepository testrunTestcaseGroupTestcaseCommentRepository;
    private final ProjectFileRepository projectFileRepository;
    private final MappingUtil mappingUtil;
    private final FileUtil fileUtil;
    private final SlackService slackService;
    private final MessageSendService messageSendService;
    private final ProjectRepository projectRepository;
    private final TestrunCommentRepository testrunCommentRepository;
    private final TestrunProfileRepository testrunProfileRepository;
    private final UserRepository userRepository;
    private final TestrunHookRepository testrunHookRepository;
    private final HttpRequestUtil httpRequestUtil;
    private final Random random = new Random();

    public TestrunTestcaseGroupTestcaseDTO selectTestrunTestcaseGroupTestcaseInfo(long testrunTestcaseGroupTestcaseId) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Testcase testcase = testrunTestcaseGroupTestcase.getTestcase();

        User createdUser = null;
        if (testcase.getCreatedBy() != null) {
            createdUser = userRepository.findById(testcase.getCreatedBy()).orElse(null);
        }
        User lastUpdatedUser = null;
        if (testcase.getLastUpdatedBy() != null) {
            lastUpdatedUser = userRepository.findById(testcase.getLastUpdatedBy()).orElse(null);
        }

        return new TestrunTestcaseGroupTestcaseDTO(testrunTestcaseGroupTestcase, createdUser, lastUpdatedUser);
    }

    private void checkIsTestrunClosed(Testrun testrun) {
        testrun.validateOpened();
    }

    public List<TestrunDTO> selectOpenedProjectTestrunList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository
            .findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(spaceCode, projectId, true);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectClosedProjectTestrunList(String spaceCode, long projectId, LocalDateTime start, LocalDateTime end) {
        List<Testrun> list = testrunRepository
            .findAllByProjectSpaceCodeAndProjectIdAndOpenedAndStartDateTimeAfterAndStartDateTimeBeforeOrProjectSpaceCodeAndProjectIdAndOpenedAndEndDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(
                spaceCode, projectId, false, start, end, spaceCode, projectId, false, start, end);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectLatestClosedProjectTestrunList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository.findTop3ByProjectSpaceCodeAndProjectIdAndOpenedOrderByEndDateTimeDesc(spaceCode, projectId, false);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunReservationDTO> selectProjectReserveTestrunList(String spaceCode, long projectId, Boolean expired) {
        List<TestrunReservation> list = testrunReservationRepository
            .findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByStartDateTimeDescIdDesc(spaceCode, projectId, expired);
        return list.stream().map(TestrunReservationDTO::new).collect(Collectors.toList());
    }

    public List<TestrunIterationDTO> selectProjectTestrunIterationList(String spaceCode, long projectId, Boolean expired) {
        List<TestrunIteration> list = testrunIterationRepository
            .findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByReserveStartDateTimeDescIdDesc(spaceCode, projectId, expired);
        return list.stream().map(TestrunIterationDTO::new).collect(Collectors.toList());
    }

    public List<TestrunReservationDTO> selectReserveTestrunList() {
        List<TestrunReservation> list = testrunReservationRepository.findAllByExpiredFalse();
        return list.stream().map((testrun -> new TestrunReservationDTO(testrun, true))).collect(Collectors.toList());
    }

    public List<TestrunIterationDTO> selectTestrunIterationList() {
        List<TestrunIteration> list = testrunIterationRepository.findAllByExpiredFalse();
        return list.stream().map((testrun -> new TestrunIterationDTO(testrun, true))).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectDeadlineTestrunList(LocalDateTime endDateTime) {
        List<Testrun> list = testrunRepository.findAllByDeadlineCloseTrueAndEndDateTimeNotNullAndEndDateTimeBeforeAndOpenedTrue(endDateTime);
        return list.stream().map((testrun -> new TestrunDTO(testrun, true))).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectProjectAllTestrunList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdOrderByEndDateTimeDescIdDesc(spaceCode, projectId);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());

    }

    public Long selectProjectOpenedTestrunCount(String spaceCode, long projectId) {
        return testrunRepository.countByProjectSpaceCodeAndProjectIdAndOpenedTrue(spaceCode, projectId);
    }

    public Long selectProjectOpenedTestrunCount(Long spaceId, long projectId) {
        return testrunRepository.countByProjectSpaceIdAndProjectIdAndOpenedTrue(spaceId, projectId);
    }

    public List<TestrunDTO> selectProjectTestrunHistoryList(String spaceCode, long projectId, LocalDateTime start, LocalDateTime end) {
        List<Testrun> list = testrunRepository
            .findAllByProjectSpaceCodeAndProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(spaceCode, projectId, start,
                end);
        return list.stream().map(testrun -> new TestrunDTO(testrun, false)).collect(Collectors.toList());
    }

    public TestrunDTO selectProjectTestrunInfo(long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunDTO(testrun, true);
    }

    public TestrunReservationDTO selectProjectTestrunReservationInfo(long testrunReservationId) {
        TestrunReservation testrunReservation = testrunReservationRepository.findById(testrunReservationId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        TestrunReservationDTO testrunReservationDTO = new TestrunReservationDTO(testrunReservation, true);
        LocalDateTime now = LocalDateTime.now();
        List<TestrunTestcaseGroupDTO> conditionalTestcaseGroupList = this
            .selectConditionalTestcaseGroups(testrunReservationDTO, now, null, new HashMap<>(), null);
        testrunReservationDTO.setConditionalTestcaseGroupList(conditionalTestcaseGroupList);

        return testrunReservationDTO;
    }

    public TestrunIterationDTO selectProjectTestrunIterationInfo(long testrunIterationId) {
        TestrunIteration testrunIteration = testrunIterationRepository.findById(testrunIterationId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunIterationDTO(testrunIteration, true);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectTestrunInfo(String spaceCode, long projectId, long testrunId) {
        List<ProjectFile> files = projectFileRepository
            .findAllByProjectIdAndFileSourceTypeAndFileSourceId(projectId, FileSourceTypeCode.TESTRUN, testrunId);

        testrunHookRepository.deleteByTestrunId(testrunId);
        testrunProfileRepository.deleteByTestrunId(testrunId);
        testrunCommentRepository.deleteByTestrunId(testrunId);
        testrunReservationRepository.updateTestrunReservationTestrunId(testrunId);
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
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectTestrunReservationInfo(String spaceCode, long projectId, long testrunReservationId) {
        testrunTestcaseGroupTestcaseRepository.deleteByTestrunReservationId(testrunReservationId);
        testrunUserRepository.deleteByTestrunReservationId(testrunReservationId);
        testrunTestcaseGroupRepository.deleteByTestrunReservationId(testrunReservationId);
        testrunReservationRepository.deleteById(testrunReservationId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectTestrunIterationInfo(String spaceCode, long projectId, long testrunIterationId) {
        testrunTestcaseGroupTestcaseRepository.deleteByTestrunIterationId(testrunIterationId);
        testrunUserRepository.deleteByTestrunIterationId(testrunIterationId);
        testrunTestcaseGroupRepository.deleteByTestrunIterationId(testrunIterationId);
        testrunIterationRepository.deleteById(testrunIterationId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateProjectTestrunStatusClosed(String spaceCode, long projectId, long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        testrun.setOpened(false);
        testrun.setClosedDate(LocalDateTime.now());
        ProjectDTO project = projectService.selectProjectInfo(spaceCode, projectId);
        if (project.isEnableTestrunAlarm() && project.getSlackUrl() != null) {
            slackService.sendTestrunClosedMessage(project.getSlackUrl(), spaceCode, projectId, new TestrunDTO(testrun));
        }
        testrunRepository.save(testrun);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateProjectTestrunStatusOpened(String spaceCode, long projectId, long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrun.setOpened(true);
        testrun.setClosedDate(null);
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if (project.isSlackAlarmEnabled() && project.getSlackUrl() != null) {
            List<ProjectUserDTO> testers = getTester(project, testrun.getTestcaseGroups());
            slackService.sendTestrunReOpenMessage(project.getSlackUrl(), spaceCode, testrun.getProject().getId(), testrun.getId(), testrun.getName(),
                testers);
        }
        testrunRepository.save(testrun);
    }

    @Transactional
    public List<TestrunTestcaseGroupTestcaseItemDTO> updateTestrunTestcaseGroupTestcaseItems(
        List<TestrunTestcaseGroupTestcaseItemDTO> testrunTestcaseGroupTestcaseItems) {
        List<TestrunTestcaseGroupTestcaseItem> result = testrunTestcaseGroupTestcaseItemRepository
            .saveAll(mappingUtil.convert(testrunTestcaseGroupTestcaseItems, TestrunTestcaseGroupTestcaseItem.class));
        return result.stream().map(TestrunTestcaseGroupTestcaseItemDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public TestrunTestcaseGroupTestcaseItemDTO updateTestrunTestcaseGroupTestcaseItem(long testrunId,
        TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItem) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        TestrunTestcaseGroupTestcaseItem result = testrunTestcaseGroupTestcaseItemRepository
            .save(mappingUtil.convert(testrunTestcaseGroupTestcaseItem, TestrunTestcaseGroupTestcaseItem.class));
        return new TestrunTestcaseGroupTestcaseItemDTO(result);
    }

    @Transactional
    public TestrunStatusDTO updateTestrunTestcaseResult(long testrunId, Long testrunTestcaseGroupTestcaseId, TestResultCode testResultCode) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        boolean done = testcaseResultUpdater(testrun, testrunTestcaseGroupTestcase, testResultCode);
        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
        testrunRepository.save(testrun);
        return new TestrunStatusDTO(testrun, done);
    }

    public void sendTestrunStatusChangeMessage(String projectToken, Long testrunSeqNumber, Long testcaseSeqNumber, boolean done) {
        Long projectId = projectService.selectProjectId(projectToken);
        Testrun testrun = testrunRepository.findAllByProjectIdAndSeqId(projectId, "R" + testrunSeqNumber)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"R" + testrunSeqNumber + " 테스트런"}));
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository
            .findAllByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(projectId, testrun.getId(),
                "TC" + testcaseSeqNumber)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"TC" + testcaseSeqNumber + " 테스트케이스"}));

        MessageData participantData = MessageData.builder().type("TESTRUN-TESTCASE-RESULT-CHANGED").build();
        participantData.addData("testrunTestcaseGroupTestcaseId", testrunTestcaseGroupTestcase.getId());
        participantData.addData("testResult", testrunTestcaseGroupTestcase.getTestResult());
        messageSendService.sendTo("projects/" + projectId + "/testruns/" + testrun.getId(), participantData);

        MessageData testrunResultChangeData = MessageData.builder().type("TESTRUN-RESULT-CHANGED").build();
        testrunResultChangeData.addData("testrunId", testrun.getId());
        testrunResultChangeData.addData("testrunStatus", new TestrunStatusDTO(testrun, done));
        messageSendService.sendTo("projects/" + projectId, testrunResultChangeData);
    }

    @Transactional
    public boolean updateTestrunTestcaseResult(String projectToken, Long testrunSeqNumber, Long testcaseSeqNumber, TestResultCode resultCode,
        String comment) {
        Long projectId = projectService.selectProjectId(projectToken);
        Testrun testrun = testrunRepository.findAllByProjectIdAndSeqId(projectId, "R" + testrunSeqNumber)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"R" + testrunSeqNumber + " 테스트런"}));
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository
            .findAllByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(projectId, testrun.getId(),
                "TC" + testcaseSeqNumber)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"TC" + testcaseSeqNumber + " 테스트케이스"}));

        boolean done = testcaseResultUpdater(testrun, testrunTestcaseGroupTestcase, resultCode);
        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
        testrunRepository.save(testrun);

        TestrunTestcaseGroupTestcaseComment testrunTestcaseGroupTestcaseComment = TestrunTestcaseGroupTestcaseComment.builder()
            .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase)
            .comment(comment).build();

        testrunTestcaseGroupTestcaseCommentRepository.save(testrunTestcaseGroupTestcaseComment);

        return done;
    }

    private boolean testcaseResultUpdater(Testrun testrun, TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase, TestResultCode testResultCode) {
        testrun.updateResult(testrunTestcaseGroupTestcase, testResultCode);
        boolean done = false;
        if (testrun.isAllTestcaseDone()) {
            testrun.setOpened(false);
            done = true;
            String spaceCode = testrun.getProject().getSpace().getCode();
            Long projectId = testrun.getProject().getId();
            ProjectDTO project = projectService.selectProjectInfo(spaceCode, projectId);
            if (project.isEnableTestrunAlarm() && project.getSlackUrl() != null) {
                slackService.sendTestrunClosedMessage(project.getSlackUrl(), spaceCode, projectId, new TestrunDTO(testrun));
            }
        }
        testrunTestcaseGroupTestcase.setTestResult(testResultCode);
        return done;
    }

    @Transactional
    public void updateTestrunTestcaseTesterRandom(String spaceCode, long projectId, long testrunId, Long testerId, Long targetId,
        TesterChangeTargetCode target, String reason) {

        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);

        List<Long> userIds = new ArrayList<>();
        testrun.getTestrunUsers().forEach((testrunUser -> {
            if (!testrunUser.getUser().getId().equals(testerId)) {
                userIds.add(testrunUser.getUser().getId());
            }
        }));

        if (userIds.size() < 1) {
            throw new ServiceException("error.no.rest.tester");
        }

        ProjectDTO project = projectService.selectProjectInfo(spaceCode, projectId);

        String beforeUserName = project.getUsers()
            .stream()
            .filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(testerId))
            .map(projectUserDTO -> projectUserDTO.getUser().getName())
            .findAny().orElse("");

        if (target.equals(TesterChangeTargetCode.ONE)) {

            int index = random.nextInt(userIds.size());
            TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(targetId)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
            testrunTestcaseGroupTestcase.setTester(User.builder().id(userIds.get(index)).build());

            if (project.isEnableTestrunAlarm() && project.getSlackUrl() != null) {
                String afterUserName = project.getUsers().stream()
                    .filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(userIds.get(index)))
                    .map(projectUserDTO -> projectUserDTO.getUser().getName())
                    .findAny().orElse("");

                slackService.sendTestrunTesterRandomChangeMessage(project.getSlackUrl(), spaceCode, projectId, testrunId, targetId,
                    testrun.getName(),
                    testrunTestcaseGroupTestcase.getTestcase().getName(), beforeUserName, afterUserName, reason);
            }
            testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
        } else if (target.equals(TesterChangeTargetCode.ALL)) {
            for (TestrunTestcaseGroup testcaseGroup : testrun.getTestcaseGroups()) {
                for (TestrunTestcaseGroupTestcase testcase : testcaseGroup.getTestcases()) {
                    if (TestResultCode.UNTESTED.equals(testcase.getTestResult()) && testcase.getTester().getId().equals(testerId)) {
                        int index = random.nextInt(userIds.size());
                        testcase.setTester(User.builder().id(userIds.get(index)).build());

                        String afterUserName = project.getUsers().stream()
                            .filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(userIds.get(index)))
                            .map(projectUserDTO -> projectUserDTO.getUser().getName())
                            .findAny().orElse("");

                        slackService.sendTestrunTesterRandomChangeMessage(project.getSlackUrl(),
                            spaceCode, projectId, testrunId,
                            testcase.getId(),
                            testrun.getName(),
                            testcase.getTestcase().getName(), beforeUserName, afterUserName, reason);
                    }
                }
            }

            testrun.getTestrunUsers().removeIf((testrunUser -> testrunUser.getUser().getId().equals(testerId)));
            testrunRepository.save(testrun);
        }

    }

    @Transactional
    public void updateTestrunTestcaseTester(String spaceCode, long projectId, long testrunId, Long testrunTestcaseGroupTestcaseId, Long testerId) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Long oldUserId = testrunTestcaseGroupTestcase.getTester().getId();
        testrunTestcaseGroupTestcase.setTester(User.builder().id(testerId).build());

        ProjectDTO project = projectService.selectProjectInfo(spaceCode, projectId);
        if (project.isEnableTestrunAlarm() && project.getSlackUrl() != null) {
            Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
            checkIsTestrunClosed(testrun);
            String beforeUserName = project.getUsers().stream().filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(oldUserId))
                .map(projectUserDTO -> projectUserDTO.getUser().getName())
                .findAny().orElse("");
            String afterUserName = project.getUsers().stream().filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(testerId))
                .map(projectUserDTO -> projectUserDTO.getUser().getName())
                .findAny().orElse("");

            slackService.sendTestrunTesterChangeMessage(project.getSlackUrl(), spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId,
                testrun.getName(),
                testrunTestcaseGroupTestcase.getTestcase().getName(), beforeUserName, afterUserName);
        }
        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
    }

    @Transactional
    public TestrunTestcaseGroupTestcaseCommentDTO updateTestrunTestcaseGroupTestcaseComment(long testrunId,
        TestrunTestcaseGroupTestcaseCommentDTO testrunTestcaseGroupTestcaseComment) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        User currentUser = userRepository.findById(SessionUtil.getUserId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrunTestcaseGroupTestcaseComment.setUser(new UserDTO(currentUser));
        TestrunTestcaseGroupTestcaseComment comment = testrunTestcaseGroupTestcaseCommentRepository
            .save(mappingUtil.convert(testrunTestcaseGroupTestcaseComment, TestrunTestcaseGroupTestcaseComment.class));
        return new TestrunTestcaseGroupTestcaseCommentDTO(comment);
    }

    @Transactional
    public void deleteTestrunTestcaseGroupTestcaseComment(long testrunId, Long testrunTestcaseGroupTestcaseCommentId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        testrunTestcaseGroupTestcaseCommentRepository.deleteById(testrunTestcaseGroupTestcaseCommentId);
    }

    @Transactional
    public void updateTestrunReserveExpired(Long testrunId, Boolean reserveExpired, Long referenceTestrunId) {
        testrunReservationRepository.updateTestrunReservationExpired(testrunId, reserveExpired, referenceTestrunId);
    }

    @Transactional
    public void updateTestrunIterationExpired(Long testrunId, Boolean expired) {
        testrunIterationRepository.updateTestrunIterationExpired(testrunId, expired);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunDTO.project.id}", value = CacheConfig.PROJECT)
    public TestrunDTO createTestrunInfo(String spaceCode, TestrunDTO testrunDTO) {
        // 프로젝트 TESTRUN SEQ 증가
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, testrunDTO.getProject().getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int currentTestrunSeq = (project.getTestrunSeq() == null ? 0 : project.getTestrunSeq()) + 1;
        project.setTestrunSeq(currentTestrunSeq);
        projectRepository.save(project);

        // 테스트런 정보 생성 및 카운트 초기 생성
        Testrun testrun = mappingUtil.convert(testrunDTO, Testrun.class);
        testrun.initializeCreateInfo(project, currentTestrunSeq);

        List<TestrunUser> testrunUsers = testrun.getTestrunUsers();
        if (!testrunUsers.isEmpty()) {
            // 프로젝트의 모든 테스트케이스 조회 및 정리
            List<Testcase> projectAllTestcases = mappingUtil
                .convert(testcaseService.selectProjectTestcaseList(testrunDTO.getProject().getId()), Testcase.class);
            Map<Long, Testcase> projectTestcaseMap = new HashMap<>();
            projectAllTestcases.forEach(testcase -> projectTestcaseMap.put(testcase.getId(), testcase));

            // 프로젝트의 모든 테스트케이스 아이템 조회 및 정리
            List<TestcaseItem> projectAllTestcaseItems = mappingUtil
                .convert(testcaseService.selectProjectTestcaseItemList(testrunDTO.getProject().getId()), TestcaseItem.class);
            Map<Long, List<TestcaseItem>> idTestcaseItemListMap = new HashMap<>();
            projectAllTestcaseItems.forEach(testcaseItem -> {
                if (!idTestcaseItemListMap.containsKey(testcaseItem.getTestcase().getId())) {
                    List<TestcaseItem> testcaseItemList = new ArrayList<>();
                    idTestcaseItemListMap.put(testcaseItem.getTestcase().getId(), testcaseItemList);
                }
                idTestcaseItemListMap.get(testcaseItem.getTestcase().getId()).add(testcaseItem);
            });

            // 프로젝트의 모든 테스트케이스 템플릿 아이템 조회 및 정리
            List<TestcaseTemplateItem> projectAllTestcaseTemplateItems = mappingUtil
                .convert(testcaseService.selectProjectTestcaseTemplateItemList(testrunDTO.getProject().getId()), TestcaseTemplateItem.class);
            Map<Long, TestcaseTemplateItem> projectTestcaseTemplateItemMap = new HashMap<>();
            projectAllTestcaseTemplateItems
                .forEach(testcaseTemplateItem -> projectTestcaseTemplateItemMap.put(testcaseTemplateItem.getId(), testcaseTemplateItem));

            // 테스트케이스, 테스트케이스 아이템, 테스트케이스 템플릿으로 테스트런 테스트케이스 정보 초기화
            testrun.initializeTestGroupAndTestCase(projectTestcaseMap, idTestcaseItemListMap, projectTestcaseTemplateItemMap, random);
        }

        // 시작 전 훅 호출
        List<TestrunHook> afterStartHooks = testrun.getHooks().stream().filter(hook -> hook.getTiming().equals(TestrunHookTiming.BEFORE_START))
            .collect(Collectors.toList());
        if (!afterStartHooks.isEmpty()) {
            afterStartHooks.forEach(hook -> {
                TestrunHookResult testrunHookResult = httpRequestUtil.request(hook.getUrl(), HttpMethod.resolve(hook.getMethod()), hook.getHeaders(),
                    hook.getBodies());
                hook.setResult(Integer.toString(testrunHookResult.getCode().value()));
                if (!testrunHookResult.getCode().equals(HttpStatus.OK)) {
                    hook.setMessage(testrunHookResult.getMessage());
                }
            });
        }

        Testrun result = testrunRepository.save(testrun);
        if (project.isSlackAlarmEnabled() && project.getSlackUrl() != null) {
            List<ProjectUserDTO> testers = getTester(project, result.getTestcaseGroups());
            slackService
                .sendTestrunStartMessage(project.getSlackUrl(), spaceCode, result.getProject().getId(), result.getId(), result.getName(), testers);
        }
        return new TestrunDTO(result);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunReservation.project.id}", value = CacheConfig.PROJECT)
    public TestrunReservationDTO createTestrunReservationInfo(String spaceCode, TestrunReservationDTO testrunReservation) {
        TestrunReservation result = testrunReservationRepository.save(mappingUtil.convert(testrunReservation, TestrunReservation.class));
        result.updateTestcaseCount();
        return new TestrunReservationDTO(result, true);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunIteration.project.id}", value = CacheConfig.PROJECT)
    public TestrunIterationDTO createTestrunIterationInfo(String spaceCode, TestrunIterationDTO testrunIteration) {
        int testcaseGroupCount = 0;
        int testcaseCount = 0;
        for (TestrunTestcaseGroupDTO testrunTestcaseGroup : testrunIteration.getTestcaseGroups()) {
            testcaseGroupCount += 1;
            testrunTestcaseGroup.setTestrunIteration(testrunIteration);
            if (testrunTestcaseGroup.getTestcases() != null) {
                for (TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                    testcaseCount += 1;
                    testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
                }
            }
        }
        testrunIteration.setTestcaseGroupCount(testcaseGroupCount);
        testrunIteration.setTestcaseCount(testcaseCount);
        testrunIteration.setExpired(false);
        TestrunIteration result = testrunIterationRepository.save(mappingUtil.convert(testrunIteration, TestrunIteration.class));
        return new TestrunIterationDTO(result, true);
    }

    private List<ProjectUserDTO> getTester(Project project, List<TestrunTestcaseGroup> testcaseGroups) {
        return testcaseGroups.stream().flatMap(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream())
            .filter(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.getTester() != null)
            .map(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.getTester().getId())
            .distinct()
            .map(userId -> {
                ProjectUser projectUser = project.getUsers().stream().filter((projectUserDTO -> projectUserDTO.getUser().getId().equals(userId)))
                    .findAny().orElse(null);
                return ProjectUserDTO.builder().id(projectUser.getId()).role(projectUser.getRole())
                    .user(UserDTO.builder().id(projectUser.getUser().getId()).name(projectUser.getUser().getName()).build())
                    .project(ProjectDTO.builder().id(projectUser.getProject().getId()).build())
                    .tags(projectUser.getTags()).build();

            }).collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunDTO.project.id}", value = CacheConfig.PROJECT)
    public TestrunDTO updateTestrunInfo(String spaceCode, TestrunDTO testrunDTO) {
        Project project = mappingUtil.convert(projectService.selectProjectInfo(spaceCode, testrunDTO.getProject().getId()), Project.class);
        Testrun updateTestrun = mappingUtil.convert(testrunDTO, Testrun.class);
        Testrun targetTestrun = testrunRepository.findById(updateTestrun.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        // 테스트런 기본정보 업데이트 및 삭제된 테스트케이스의 테스터들 제거, 추가된 테스트케이스의 테스터들 추가, 테스트케이스 그룹의 업데이트
        targetTestrun.updateInfo(updateTestrun);
        targetTestrun.updateTestrunUsers(updateTestrun.getTestrunUsers());
        targetTestrun.updateTestcaseGroups(updateTestrun.getTestcaseGroups());

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
                        Testcase testcase = mappingUtil.convert(
                            testcaseService
                                .selectTestcaseInfo(updateTestrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId()),
                            Testcase.class);
                        if (testrunTestcaseGroupTestcase.getId() == null) {
                            // 신규 생성된 테스트 케이스 그룹의 테스트케이스에 테스터 설정
                            currentSeq = testrunTestcaseGroupTestcase.assignTester(project, testcase, testrunUsers, currentSeq, random);
                        } else {
                            // 존재하는 테스트케이스에 테스터가 삭제된 경우 신규 테스터 할당
                            currentSeq = testrunTestcaseGroupTestcase.reAssignTester(project, testcase, testrunUsers, currentSeq, random);
                            currentSeq = testcase.assignTester(testrunTestcaseGroupTestcase, testrunUsers, random, currentSeq);
                        }
                    }
                }
            }
        }
        int totalTestCount = targetTestrun.calculateTotalTestcaseCount();
        targetTestrun.setTotalTestcaseCount(totalTestCount);
        Testrun result = testrunRepository.save(targetTestrun);
        return new TestrunDTO(result, true);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunReservation.project.id}", value = CacheConfig.PROJECT)
    public TestrunReservationDTO updateTestrunReservationInfo(String spaceCode, TestrunReservationDTO testrunReservation) {
        TestrunReservation newTestrunReservation = mappingUtil.convert(testrunReservation, TestrunReservation.class);

        TestrunReservation targetTestrunReservation = testrunReservationRepository.findById(testrunReservation.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestrunReservation.updateInfo(newTestrunReservation);
        targetTestrunReservation.updateTestrunUsers(newTestrunReservation.getTestrunUsers());
        targetTestrunReservation.updateTestcaseGroups(newTestrunReservation.getTestcaseGroups());
        targetTestrunReservation.updateTestcaseAndGroupCount();

        TestrunReservation result = testrunReservationRepository.save(targetTestrunReservation);
        return new TestrunReservationDTO(result);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunIteration.project.id}", value = CacheConfig.PROJECT)
    public TestrunIterationDTO updateTestrunIterationInfo(String spaceCode, TestrunIterationDTO testrunIteration, boolean updateIterationInfo) {
        TestrunIteration newTestrunIteration = mappingUtil.convert(testrunIteration, TestrunIteration.class);
        TestrunIteration targetTestrunIteration = testrunIterationRepository
            .findById(testrunIteration.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestrunIteration.updateInfo(newTestrunIteration);
        targetTestrunIteration.updateTester(testrunIteration.getTestrunUsers());
        if (updateIterationInfo) {
            targetTestrunIteration.updateIterationInfo(testrunIteration);
        }

        // 삭제된 테스트런 테스트케이스 그룹 및 테스트케이스 제거
        targetTestrunIteration.updateTestcaseGroups(newTestrunIteration.getTestcaseGroups());

        int testcaseGroupCount = targetTestrunIteration.getTestcaseGroups().size();
        int testcaseCount = targetTestrunIteration.getTestcaseGroups().stream()
            .map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0)
            .reduce(0, Integer::sum);

        targetTestrunIteration.setTestcaseGroupCount(testcaseGroupCount);
        targetTestrunIteration.setTestcaseCount(testcaseCount);

        List<Long> currentFilteringUserIds = targetTestrunIteration.getCurrentFilteringUserIds();
        if (currentFilteringUserIds != null) {
            currentFilteringUserIds.removeIf((userId) -> testrunIteration.getTestrunUsers().stream()
                .noneMatch((testrunUserDTO -> testrunUserDTO.getUser().getId().equals(userId))));
        }

        TestrunIteration result = testrunIterationRepository.save(targetTestrunIteration);
        return new TestrunIterationDTO(result);
    }

    public List<TestrunDTO> selectUserAssignedTestrunList(String spaceCode, long projectId, Long userId) {
        List<Testrun> testruns = testrunRepository
            .findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(spaceCode, projectId, true);

        List<Testrun> list = testruns
            .stream()
            .filter(testrun -> testrun.containsTester(userId))
            .map(testrun -> {
                List<TestrunTestcaseGroup> userTestcaseGroupList = testrun.getTestcaseGroups()
                    .stream()
                    .filter(
                        testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream()
                            .anyMatch((testrunTestcaseGroupTestcase -> userId
                                .equals(testrunTestcaseGroupTestcase.getTester().getId()))))
                    .map((testrunTestcaseGroup -> {
                        List<TestrunTestcaseGroupTestcase> userTestcaseList = testrunTestcaseGroup.getTestcases().stream()
                            .filter((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId())))
                            .collect(Collectors.toList());
                        testrunTestcaseGroup.setTestcases(userTestcaseList);
                        return testrunTestcaseGroup;
                    })).collect(Collectors.toList());
                testrun.setTestcaseGroups(userTestcaseGroupList);
                return testrun;
            })
            .collect(Collectors.toList());

        return list.stream().map(testrun -> new TestrunDTO(testrun, true)).collect(Collectors.toList());
    }

    private String getParticipantId(String spaceCode, Long projectId, Long testrunId, Long userId, String sessionId) {
        return spaceCode + "-" + projectId + "-" + testrunId + "-" + userId + "-" + sessionId;
    }

    @Transactional
    public TestrunParticipantDTO createTestrunParticipantInfo(String spaceCode, Long projectId, Long testrunId, UserDTO user, String sessionId) {
        TestrunParticipant participant = TestrunParticipant.builder()
            .id(getParticipantId(spaceCode, projectId, testrunId, user.getId(), sessionId))
            .spaceCode(spaceCode)
            .projectId(projectId)
            .testrunId(testrunId)
            .sessionId(sessionId)
            .userId(user.getId())
            .userName(user.getName())
            .userEmail(user.getEmail())
            .build();

        return new TestrunParticipantDTO(testrunParticipantRedisRepository.save(participant));
    }

    @Transactional
    public void deleteTestrunParticipantInfo(TestrunParticipantDTO testrunParticipantDTO) {
        testrunParticipantRedisRepository
            .findById(testrunParticipantDTO.getId())
            .ifPresent(testrunParticipantRedisRepository::delete);
    }

    public List<TestrunParticipantDTO> selectTestrunParticipantList(String spaceCode, Long projectId, Long testrunId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository
            .findAllBySpaceCodeAndProjectIdAndTestrunId(spaceCode, projectId, testrunId);
        return testrunParticipants.stream().map(TestrunParticipantDTO::new).collect(Collectors.toList());
    }

    public TestrunParticipantDTO selectTestrunParticipantInfo(String spaceCode, Long projectId, Long testrunId, Long userId, String sessionId) {
        Optional<TestrunParticipant> testrunParticipant = testrunParticipantRedisRepository.findById(
            getParticipantId(spaceCode, projectId, testrunId, userId, sessionId));
        if (testrunParticipant.isPresent()) {
            return new TestrunParticipantDTO(testrunParticipant.get());
        }
        return null;

    }

    public boolean isExistParticipant(Long testrunId, Long userId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository.findAllByTestrunIdAndUserId(testrunId, userId);
        return testrunParticipants.size() > 0;
    }

    public List<TestrunParticipantDTO> selectTestrunParticipantList(Long userId, String sessionId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository.findAllByUserIdAndSessionId(userId, sessionId);
        return testrunParticipants.stream().map(TestrunParticipantDTO::new).collect(Collectors.toList());
    }

    public List<Long> selectTestcaseIncludeTestrunList(String projectToken, Long testcaseSeqNumber) {
        Long projectId = projectService.selectProjectId(projectToken);
        return testrunRepository.findAllByProjectIdAndTestcaseSeqId(projectId, "TC" + testcaseSeqNumber);
    }

    public List<TestrunTestcaseGroupDTO> selectConditionalTestcaseGroups(TestrunReservationDTO testrunReservationDTO, LocalDateTime now,
        List<TestrunTestcaseGroupDTO> pTestcaseGroups, Map<Long, ArrayList<Long>> testcaseGroupIdMap, TestrunDTO testrun) {

        List<TestrunTestcaseGroupDTO> testcaseGroups = pTestcaseGroups == null ? new ArrayList<>() : pTestcaseGroups;

        List<TestcaseDTO> conditionalTestcaseList = new ArrayList<>();
        Map<Long, Boolean> conditionalTestcaseIdMap = new HashMap<>();
        if (testrunReservationDTO.getSelectCreatedTestcase() != null && testrunReservationDTO.getSelectCreatedTestcase()) {
            List<TestcaseDTO> createdTestcaseList = testcaseService
                .selectTestcaseItemListByCreationTime(testrunReservationDTO.getProject().getId(), testrunReservationDTO.getCreationDate(), now);
            for (TestcaseDTO testcaseDTO : createdTestcaseList) {
                conditionalTestcaseList.add(testcaseDTO);
                conditionalTestcaseIdMap.put(testcaseDTO.getId(), true);
            }
        }

        if (testrunReservationDTO.getSelectUpdatedTestcase() != null && testrunReservationDTO.getSelectUpdatedTestcase()) {
            List<TestcaseDTO> updateDateTestcaseList = testcaseService
                .selectTestcaseItemListByContentUpdateDate(testrunReservationDTO.getProject().getId(), testrunReservationDTO.getCreationDate(), now);

            for (TestcaseDTO testcaseDTO : updateDateTestcaseList) {
                if (!conditionalTestcaseIdMap.containsKey(testcaseDTO.getId())) {
                    conditionalTestcaseList.add(testcaseDTO);
                    conditionalTestcaseIdMap.put(testcaseDTO.getId(), true);
                }
            }
        }

        if (CollectionUtils.isEmpty(conditionalTestcaseList)) {
            conditionalTestcaseList.forEach(testcaseDTO -> {
                Long testcaseGroupId = testcaseDTO.getTestcaseGroup().getId();
                Long testcaseId = testcaseDTO.getId();
                if (!testcaseGroupIdMap.containsKey(testcaseGroupId)) {
                    TestrunTestcaseGroupDTO testrunTestcaseGroupDTO = TestrunTestcaseGroupDTO.builder()
                        .testrun(testrun)
                        .testcaseGroup(testcaseDTO.getTestcaseGroup())
                        .testcases(new ArrayList<>())
                        .build();
                    testcaseGroups.add(testrunTestcaseGroupDTO);
                    testcaseGroupIdMap.put(testcaseGroupId, new ArrayList<>());
                }

                ArrayList<Long> testcaseIds = testcaseGroupIdMap.get(testcaseGroupId);
                if (!testcaseIds.contains(testcaseId)) {
                    TestrunTestcaseGroupDTO testcaseGroup = testcaseGroups.stream()
                        .filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getTestcaseGroup().getId().equals(testcaseGroupId))
                        .findFirst()
                        .orElse(null);
                    if (testcaseGroup != null) {
                        TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcaseDTO = TestrunTestcaseGroupTestcaseDTO.builder()
                            .testrunTestcaseGroup(testcaseGroup)
                            .testcase(testcaseDTO)
                            .build();

                        testrunTestcaseGroupTestcaseDTO.setTestcaseItems(
                            testcaseDTO.getTestcaseItems()
                                .stream()
                                .map(testcaseItemDTO -> TestrunTestcaseGroupTestcaseItemDTO.builder()
                                    .testcaseTemplateItem(testcaseItemDTO.getTestcaseTemplateItem())
                                    .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcaseDTO)
                                    .type(testcaseItemDTO.getType())
                                    .value(testcaseItemDTO.getValue())
                                    .text(testcaseItemDTO.getText())
                                    .build()
                                ).collect(Collectors.toList()));
                        testcaseGroup.getTestcases().add(testrunTestcaseGroupTestcaseDTO);
                        testcaseIds.add(testcaseId);
                    }
                }
            });
        }

        return testcaseGroups;
    }

    @Transactional
    public TestrunCommentDTO createTestrunComment(long projectId, long testrunId, long userId, TestrunCommentDTO testrunCommentDTO) {
        testrunRepository.findAllByProjectIdAndId(projectId, testrunId).orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST));
        TestrunComment testrunComment = TestrunComment.builder().comment(testrunCommentDTO.getComment())
            .testrun(Testrun.builder().id(testrunId).build()).user(User.builder().id(userId).build())
            .build();
        TestrunComment comment = testrunCommentRepository.save(testrunComment);
        User user = userRepository.findById(comment.getUser().getId()).orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST));
        comment.setUser(user);
        return new TestrunCommentDTO(comment);
    }

    public List<TestrunCommentDTO> selectTestrunCommentList(Long projectId, Long testrunId) {
        List<TestrunComment> testrunCommentList = testrunCommentRepository
            .findAllByTestrunProjectIdAndTestrunIdOrderByCreationDateAsc(projectId, testrunId);
        return testrunCommentList.stream().map(TestrunCommentDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public void deleteTestrunCommentInfo(Long projectId, Long testrunId, Long commentId) {
        TestrunComment testrunComment = testrunCommentRepository.findByTestrunProjectIdAndTestrunIdAndId(projectId, testrunId, commentId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if (SessionUtil.getUserId() != null && SessionUtil.getUserId().equals(testrunComment.getUser().getId())) {
            testrunCommentRepository.delete(testrunComment);
        } else {
            throw new ServiceException(HttpStatus.UNAUTHORIZED);
        }
    }

    public List<TestrunDTO> selectOpenedTestrunList() {
        List<Testrun> list = testrunRepository.findAllByOpenedTrueAndEndDateTimeNotNull();
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunTestcaseGroupTestcaseDTO> selectUntestedTestrunTestcaseGroupTestcaseList(Long testrunId) {
        List<TestrunTestcaseGroupTestcase> list = testrunTestcaseGroupTestcaseRepository.findAllByTestrunTestcaseGroupTestrunIdAndAndTestResult(
            testrunId, TestResultCode.UNTESTED);
        return list.stream().map(TestrunTestcaseGroupTestcaseDTO::new).collect(Collectors.toList());
    }


    public List<TestrunTestcaseGroupTestcaseDTO> selectTestcaseTestrunResultHistory(String spaceCode, long projectId, long testcaseId,
        Long currentTestrunId, Integer pageNo) {
        Pageable pageInfo = PageRequest.of(Optional.ofNullable(pageNo).orElse(0), 10);
        List<TestrunTestcaseGroupTestcase> list = testrunTestcaseGroupTestcaseRepository.findAllByTestcaseProjectIdAndTestcaseIdAndTestrunTestcaseGroupTestrunIdNotOrderByCreationDateDesc(
            projectId,
            testcaseId, currentTestrunId, pageInfo);
        return list.stream().map(TestrunTestcaseGroupTestcaseDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional
    public TestrunHookDTO updateTestrunHook(TestrunHookDTO testrunHookDTO) {
        TestrunHook testrunHook = mappingUtil.convert(testrunHookDTO, TestrunHook.class);
        testrunHookRepository.save(testrunHook);
        return new TestrunHookDTO(testrunHook);
    }

}
