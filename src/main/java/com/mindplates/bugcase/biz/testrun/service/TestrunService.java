package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.dto.*;
import com.mindplates.bugcase.biz.testrun.entity.*;
import com.mindplates.bugcase.biz.testrun.repository.*;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.message.MessageSendService;
import com.mindplates.bugcase.common.message.vo.MessageData;
import com.mindplates.bugcase.common.service.SlackService;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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

    private final TestcaseRepository testcaseRepository;

    private final MessageSourceAccessor messageSourceAccessor;
    private final Random random = new Random();
    @Value("${bug-case.web-url}")
    private String webUrl;

    public TestrunTestcaseGroupTestcaseDTO selectTestrunTestcaseGroupTestcaseInfo(long testrunTestcaseGroupTestcaseId) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunTestcaseGroupTestcaseDTO(testrunTestcaseGroupTestcase);
    }

    private void checkIsTestrunClosed(Testrun testrun) {
        if (!testrun.isOpened()) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "project.already.closed");
        }
    }


    public List<TestrunDTO> selectOpenedProjectTestrunList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(spaceCode, projectId, true);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectClosedProjectTestrunList(String spaceCode, long projectId, LocalDateTime start, LocalDateTime end) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedAndStartDateTimeAfterAndStartDateTimeBeforeOrProjectSpaceCodeAndProjectIdAndOpenedAndEndDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(spaceCode, projectId, false, start, end, spaceCode, projectId, false, start, end);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectLatestClosedProjectTestrunList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository.findTop3ByProjectSpaceCodeAndProjectIdAndOpenedOrderByEndDateTimeDesc(spaceCode, projectId, false);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunReservationDTO> selectProjectReserveTestrunList(String spaceCode, long projectId, Boolean expired) {
        List<TestrunReservation> list = testrunReservationRepository.findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByStartDateTimeDescIdDesc(spaceCode, projectId, expired);
        return list.stream().map(TestrunReservationDTO::new).collect(Collectors.toList());
    }

    public List<TestrunIterationDTO> selectProjectTestrunIterationList(String spaceCode, long projectId, Boolean expired) {
        List<TestrunIteration> list = testrunIterationRepository.findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByReserveStartDateTimeDescIdDesc(spaceCode, projectId, expired);
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
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(spaceCode, projectId, start, end);
        return list.stream().map(testrun -> new TestrunDTO(testrun, false)).collect(Collectors.toList());
    }

    public TestrunDTO selectProjectTestrunInfo(long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunDTO(testrun, true);
    }

    public TestrunReservationDTO selectProjectTestrunReservationInfo(long testrunReservationId) {
        TestrunReservation testrunReservation = testrunReservationRepository.findById(testrunReservationId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        TestrunReservationDTO testrunReservationDTO = new TestrunReservationDTO(testrunReservation, true);
        LocalDateTime now = LocalDateTime.now();
        List<TestrunTestcaseGroupDTO> conditionalTestcaseGroupList = this.selectConditionalTestcaseGroups(testrunReservationDTO, now, null, new HashMap<>(), null);
        testrunReservationDTO.setConditionalTestcaseGroupList(conditionalTestcaseGroupList);

        return testrunReservationDTO;
    }

    public TestrunIterationDTO selectProjectTestrunIterationInfo(long testrunIterationId) {
        TestrunIteration testrunIteration = testrunIterationRepository.findById(testrunIterationId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunIterationDTO(testrunIteration, true);
    }

    public TestrunDTO selectProjectTestrunInfo(long projectId, long testrunSeqNumber) {
        Testrun testrun = testrunRepository.findAllByProjectIdAndSeqId(projectId, "R" + testrunSeqNumber).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunDTO(testrun, true);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectTestrunInfo(String spaceCode, long projectId, long testrunId) {

        List<ProjectFile> files = projectFileRepository.findAllByProjectIdAndFileSourceTypeAndFileSourceId(projectId, FileSourceTypeCode.TESTRUN, testrunId);

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
        if (project.isEnableTestrunAlarm() && project.getSlackUrl() != null) {
            List<ProjectUserDTO> testers = getTester(project, testrun.getTestcaseGroups());
            slackService.sendTestrunReOpenMessage(project.getSlackUrl(), spaceCode, testrun.getProject().getId(), testrun.getId(), testrun.getName(), testers);
        }

        testrunRepository.save(testrun);
    }

    @Transactional
    public List<TestrunTestcaseGroupTestcaseItemDTO> updateTestrunTestcaseGroupTestcaseItems(List<TestrunTestcaseGroupTestcaseItemDTO> testrunTestcaseGroupTestcaseItems) {
        List<TestrunTestcaseGroupTestcaseItem> result = testrunTestcaseGroupTestcaseItemRepository.saveAll(mappingUtil.convert(testrunTestcaseGroupTestcaseItems, TestrunTestcaseGroupTestcaseItem.class));
        return result.stream().map(TestrunTestcaseGroupTestcaseItemDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public TestrunTestcaseGroupTestcaseItemDTO updateTestrunTestcaseGroupTestcaseItem(long testrunId, TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItem) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        TestrunTestcaseGroupTestcaseItem result = testrunTestcaseGroupTestcaseItemRepository.save(mappingUtil.convert(testrunTestcaseGroupTestcaseItem, TestrunTestcaseGroupTestcaseItem.class));
        return new TestrunTestcaseGroupTestcaseItemDTO(result);
    }

    @Transactional
    public TestrunStatusDTO updateTestrunTestcaseResult(long testrunId, Long testrunTestcaseGroupTestcaseId, TestResultCode testResultCode) {

        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        boolean done = testcaseResultUpdater(testrun, testrunTestcaseGroupTestcase, testResultCode);
        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
        testrunRepository.save(testrun);

        return new TestrunStatusDTO(testrun, done);
    }

    public void sendTestrunStatusChangeMessage(String projectToken, Long testrunSeqNumber, Long testcaseSeqNumber, boolean done) {
        Long projectId = projectService.selectProjectId(projectToken);
        Testrun testrun = testrunRepository.findAllByProjectIdAndSeqId(projectId, "R" + testrunSeqNumber).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"R" + testrunSeqNumber + " 테스트런"}));
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findAllByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(projectId, testrun.getId(), "TC" + testcaseSeqNumber).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"TC" + testcaseSeqNumber + " 테스트케이스"}));

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
    public boolean updateTestrunTestcaseResult(String projectToken, Long testrunSeqNumber, Long testcaseSeqNumber, TestResultCode resultCode, String comment) {

        Long projectId = projectService.selectProjectId(projectToken);
        Testrun testrun = testrunRepository.findAllByProjectIdAndSeqId(projectId, "R" + testrunSeqNumber).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"R" + testrunSeqNumber + " 테스트런"}));
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findAllByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(projectId, testrun.getId(), "TC" + testcaseSeqNumber).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "target.not.found", new String[]{"TC" + testcaseSeqNumber + " 테스트케이스"}));

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
        if (testrunTestcaseGroupTestcase.getTestResult() == null) {

        } else if (testrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.PASSED)) {
            testrun.setPassedTestcaseCount(testrun.getPassedTestcaseCount() - 1);
        } else if (testrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.FAILED)) {
            testrun.setFailedTestcaseCount(testrun.getFailedTestcaseCount() - 1);
        } else if (testrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.UNTESTABLE)) {
            testrun.setUntestableTestcaseCount(testrun.getUntestableTestcaseCount() - 1);
        }

        if (testResultCode.equals(TestResultCode.PASSED)) {
            testrun.setPassedTestcaseCount(testrun.getPassedTestcaseCount() + 1);
        } else if (testResultCode.equals(TestResultCode.FAILED)) {
            testrun.setFailedTestcaseCount(testrun.getFailedTestcaseCount() + 1);
        } else if (testResultCode.equals(TestResultCode.UNTESTABLE)) {
            testrun.setUntestableTestcaseCount(testrun.getUntestableTestcaseCount() + 1);
        }

        boolean done = false;
        if (testrun.getTotalTestcaseCount() <= testrun.getPassedTestcaseCount() + testrun.getFailedTestcaseCount() + testrun.getUntestableTestcaseCount()) {
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
    public void updateTestrunTestcaseTester(String spaceCode, long projectId, long testrunId, Long testrunTestcaseGroupTestcaseId, Long testerId) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Long oldUserId = testrunTestcaseGroupTestcase.getTester().getId();
        testrunTestcaseGroupTestcase.setTester(User.builder().id(testerId).build());

        ProjectDTO project = projectService.selectProjectInfo(spaceCode, projectId);
        if (project.isEnableTestrunAlarm() && project.getSlackUrl() != null) {
            Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
            checkIsTestrunClosed(testrun);
            String beforeUserName = project.getUsers().stream().filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(oldUserId)).map(projectUserDTO -> projectUserDTO.getUser().getName()).findAny().orElse("");
            String afterUserName = project.getUsers().stream().filter(projectUserDTO -> projectUserDTO.getUser().getId().equals(testerId)).map(projectUserDTO -> projectUserDTO.getUser().getName()).findAny().orElse("");

            slackService.sendTestrunTesterChangeMessage(project.getSlackUrl(), spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId, testrun.getName(), testrunTestcaseGroupTestcase.getTestcase().getName(), beforeUserName, afterUserName);
        }

        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
    }

    @Transactional
    public TestrunTestcaseGroupTestcaseCommentDTO updateTestrunTestcaseGroupTestcaseComment(long testrunId, TestrunTestcaseGroupTestcaseCommentDTO testrunTestcaseGroupTestcaseComment) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        checkIsTestrunClosed(testrun);
        TestrunTestcaseGroupTestcaseComment comment = testrunTestcaseGroupTestcaseCommentRepository.save(mappingUtil.convert(testrunTestcaseGroupTestcaseComment, TestrunTestcaseGroupTestcaseComment.class));
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
    @CacheEvict(key = "{#spaceCode,#testrun.project.id}", value = CacheConfig.PROJECT)
    public Long createTestrunInfo(String spaceCode, TestrunDTO testrun) {

        // 프로젝트 TESTRUN SEQ 증가
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, testrun.getProject().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int currentTestrunSeq = (project.getTestrunSeq() == null ? 0 : project.getTestrunSeq()) + 1;
        project.setTestrunSeq(currentTestrunSeq);
        projectRepository.save(project);

        // 테스트런 정보 생성
        testrun.setSeqId("R" + currentTestrunSeq);
        testrun.setOpened(true);
        int totalTestCount = testrun.getTestcaseGroups().stream().map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0).reduce(0, Integer::sum);

        // 태그별 사용자 정보 분류
        List<TestrunUserDTO> testrunUsers = testrun.getTestrunUsers();
        Map<String, List<ProjectUserDTO>> tagUserMap = new HashMap<>();
        project.getUsers().forEach((projectUser -> {
            String tagString = projectUser.getTags();
            if (tagString != null) {
                String[] tags = tagString.split(";");
                if (tags.length > 0) {
                    Arrays.stream(tags).forEach((tag) -> {
                        if (tag.length() > 0) {
                            if (!tagUserMap.containsKey(tag)) {
                                tagUserMap.put(tag, new ArrayList<>());
                            }

                            List<ProjectUserDTO> users = tagUserMap.get(tag);
                            if (testrunUsers.stream().anyMatch(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(projectUser.getUser().getId()))) {
                                users.add(ProjectUserDTO.builder()
                                        .id(projectUser.getId())
                                        .user(UserDTO.builder().id(projectUser.getUser().getId()).build())
                                        .build());
                            }
                        }
                    });
                }
            }
        }));

        tagUserMap.keySet().removeIf(key -> tagUserMap.get(key).isEmpty());


        if (!testrunUsers.isEmpty()) {


            // 프로젝트의 모든 테스트케이스 조회 및 정리
            List<TestcaseDTO> projectAllTestcases = testcaseService.selectProjectTestcaseList(testrun.getProject().getId());
            Map<Long, TestcaseDTO> projectTestcaseMap = new HashMap<>();
            projectAllTestcases.forEach(testcase -> projectTestcaseMap.put(testcase.getId(), testcase));

            // 프로젝트의 모든 테스트케이스 아이템 조회 및 정리
            List<TestcaseItemDTO> projectAllTestcaseItems = testcaseService.selectProjectTestcaseItemList(testrun.getProject().getId());
            Map<Long, List<TestcaseItemDTO>> testcaseItemListMapByTestcaseId = new HashMap<>();
            projectAllTestcaseItems.forEach(testcaseItem -> {
                if (!testcaseItemListMapByTestcaseId.containsKey(testcaseItem.getTestcase().getId())) {
                    List<TestcaseItemDTO> testcaseItemDTOS = new ArrayList<>();
                    testcaseItemListMapByTestcaseId.put(testcaseItem.getTestcase().getId(), testcaseItemDTOS);
                }

                testcaseItemListMapByTestcaseId.get(testcaseItem.getTestcase().getId()).add(testcaseItem);
            });

            // 프로젝트의 모든 테스트케이스 템플릿 아이템 조회 및 정리
            List<TestcaseTemplateItemDTO> projectAllTestcaseTemplateItems = testcaseService.selectProjectTestcaseTemplateItemList(testrun.getProject().getId());
            Map<Long, TestcaseTemplateItemDTO> projectTestcaseTemplateItemMap = new HashMap<>();
            projectAllTestcaseTemplateItems.forEach(testcaseTemplateItem -> projectTestcaseTemplateItemMap.put(testcaseTemplateItem.getId(), testcaseTemplateItem));

            int currentSeq = random.nextInt(testrunUsers.size());
            for (TestrunTestcaseGroupDTO testrunTestcaseGroup : testrun.getTestcaseGroups()) {
                testrunTestcaseGroup.setTestrun(testrun);
                if (testrunTestcaseGroup.getTestcases() != null) {
                    for (TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                        testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
                        TestcaseDTO testcase = projectTestcaseMap.get(testrunTestcaseGroupTestcase.getTestcase().getId());
                        if (testcase == null) {
                            continue;
                        }

                        List<TestcaseItemDTO> testcaseItems = testcaseItemListMapByTestcaseId.get(testcase.getId());
                        testrunTestcaseGroupTestcase.setTestResult(TestResultCode.UNTESTED);
                        // 테스터 입력
                        if ("tag".equals(testcase.getTesterType())) {
                            if (tagUserMap.containsKey(testcase.getTesterValue())) {
                                List<ProjectUserDTO> tagUsers = tagUserMap.get(testcase.getTesterValue());
                                int userIndex = random.nextInt(tagUsers.size());
                                testrunTestcaseGroupTestcase.setTester(UserDTO.builder().id(tagUsers.get(userIndex).getUser().getId()).build());
                            } else {
                                int userIndex = random.nextInt(testrunUsers.size());
                                testrunTestcaseGroupTestcase.setTester(UserDTO.builder().id(testrunUsers.get(userIndex).getUser().getId()).build());
                            }
                        } else if ("operation".equals(testcase.getTesterType())) {
                            if ("RND".equals(testcase.getTesterValue())) {
                                int userIndex = random.nextInt(testrunUsers.size());
                                testrunTestcaseGroupTestcase.setTester(UserDTO.builder().id(testrunUsers.get(userIndex).getUser().getId()).build());
                            } else if ("SEQ".equals(testcase.getTesterValue())) {
                                if (currentSeq > testrunUsers.size() - 1) {
                                    currentSeq = 0;
                                }

                                testrunTestcaseGroupTestcase.setTester(UserDTO.builder().id(testrunUsers.get(currentSeq).getUser().getId()).build());
                                currentSeq++;
                            }
                        } else {
                            testrunTestcaseGroupTestcase.setTester(UserDTO.builder().id(Long.parseLong(testcase.getTesterValue())).build());
                        }

                        for (TestcaseItemDTO testcaseItem : testcaseItems) {

                            if (testcaseItem.getValue() == null) {
                                continue;
                            }

                            TestcaseTemplateItemDTO testcaseTemplateItem = projectTestcaseTemplateItemMap.get(testcaseItem.getTestcaseTemplateItem().getId());
                            if (testcaseTemplateItem == null) {
                                continue;
                            }

                            if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {

                                TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItemDTO.builder().testcaseTemplateItem(testcaseTemplateItem).testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase).type("value").build();

                                if ("RND".equals(testcaseItem.getValue())) {
                                    int userIndex = random.nextInt(testrunUsers.size());
                                    testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(userIndex).getUser().getId().toString());
                                } else if ("SEQ".equals(testcaseItem.getValue())) {

                                    if (currentSeq > testrunUsers.size() - 1) {
                                        currentSeq = 0;
                                    }

                                    testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(currentSeq).getUser().getId().toString());

                                    currentSeq++;

                                } else {
                                    testrunTestcaseGroupTestcaseItem.setValue(testcaseItem.getValue());
                                }

                                if (testrunTestcaseGroupTestcase.getTestcaseItems() == null) {
                                    testrunTestcaseGroupTestcase.setTestcaseItems(new ArrayList<>());
                                }
                                testrunTestcaseGroupTestcase.getTestcaseItems().add(testrunTestcaseGroupTestcaseItem);
                            }
                        }
                    }
                }
            }
        }


        testrun.setTotalTestcaseCount(totalTestCount);
        testrun.setPassedTestcaseCount(0);
        testrun.setFailedTestcaseCount(0);
        testrun.setUntestableTestcaseCount(0);

        Testrun result = testrunRepository.save(mappingUtil.convert(testrun, Testrun.class));

        if (project.isEnableTestrunAlarm() && project.getSlackUrl() != null) {
            List<ProjectUserDTO> testers = getTester(project, result.getTestcaseGroups());
            slackService.sendTestrunStartMessage(project.getSlackUrl(), spaceCode, result.getProject().getId(), result.getId(), result.getName(), testers);
        }

        return result.getId();
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunReservation.project.id}", value = CacheConfig.PROJECT)
    public TestrunReservationDTO createTestrunReservationInfo(String spaceCode, TestrunReservationDTO testrunReservation) {

        int testcaseGroupCount = 0;
        int testcaseCount = 0;

        if (testrunReservation.getTestcaseGroups() != null) {
            for (TestrunTestcaseGroupDTO testrunTestcaseGroup : testrunReservation.getTestcaseGroups()) {
                testcaseGroupCount += 1;
                testrunTestcaseGroup.setTestrunReservation(testrunReservation);

                if (testrunTestcaseGroup.getTestcases() != null) {
                    for (TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                        testcaseCount += 1;
                        testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
                    }
                }
            }
        }

        testrunReservation.setTestcaseGroupCount(testcaseGroupCount);
        testrunReservation.setTestcaseCount(testcaseCount);

        TestrunReservation result = testrunReservationRepository.save(mappingUtil.convert(testrunReservation, TestrunReservation.class));

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
        return testcaseGroups.stream().flatMap(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream()).map(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.getTester().getId()).distinct().map(userId -> {
            ProjectUser projectUser = project.getUsers().stream().filter((projectUserDTO -> projectUserDTO.getUser().getId().equals(userId))).findAny().orElse(null);
            return ProjectUserDTO.builder()
                    .id(projectUser.getId())
                    .role(projectUser.getRole())
                    .user(UserDTO.builder().id(projectUser.getUser().getId()).name(projectUser.getUser().getName()).build())
                    .project(ProjectDTO.builder().id(projectUser.getProject().getId()).build())
                    .tags(projectUser.getTags())
                    .build();

        }).collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrun.project.id}", value = CacheConfig.PROJECT)
    public TestrunDTO updateTestrunInfo(String spaceCode, TestrunDTO testrun) {

        ProjectDTO project = projectService.selectProjectInfo(spaceCode, testrun.getProject().getId());

        Testrun targetTestrun = testrunRepository.findById(testrun.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        targetTestrun.setName(testrun.getName());
        targetTestrun.setDescription(testrun.getDescription());
        targetTestrun.setStartDateTime(testrun.getStartDateTime());
        targetTestrun.setEndDateTime(testrun.getEndDateTime());
        targetTestrun.setOpened(testrun.isOpened());
        targetTestrun.setDays(testrun.getDays());
        targetTestrun.setExcludeHoliday(testrun.getExcludeHoliday());
        targetTestrun.setStartTime(testrun.getStartTime());
        targetTestrun.setDurationHours(testrun.getDurationHours());
        targetTestrun.setReserveExpired(testrun.getReserveExpired());
        targetTestrun.setDeadlineClose(testrun.getDeadlineClose());
        // 삭제된 테스트 제거
        targetTestrun.getTestrunUsers().removeIf((testrunUser -> testrun.getTestrunUsers().stream().noneMatch((testrunUserDTO -> testrunUserDTO.getUser().getId().equals(testrunUser.getUser().getId())))));
        // 추가된 테스터 추가
        targetTestrun.getTestrunUsers().addAll(testrun.getTestrunUsers().stream().filter(testrunUserDTO -> targetTestrun.getTestrunUsers().stream().noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunUserDTO.getUser().getId()))).map((testrunUserDTO -> TestrunUser.builder().user(User.builder().id(testrunUserDTO.getUser().getId()).build()).testrun(targetTestrun).build())).collect(Collectors.toList()));

        List<TestrunUser> testrunUsers = targetTestrun.getTestrunUsers();
        Map<String, List<ProjectUserDTO>> tagUserMap = getTagUserMap(project, testrunUsers);


        int currentSeq = -1;
        if (!testrunUsers.isEmpty()) {
            currentSeq = random.nextInt(testrunUsers.size());
        }

        // 삭제된 테스트런 테스트케이스 그룹 제거
        targetTestrun.getTestcaseGroups().removeIf((testrunTestcaseGroup -> testrun.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).noneMatch((testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testrunTestcaseGroup.getId())))));
        // 삭제된 테스트런 테스트케이스 그룹 테스트케이스 제거
        for (TestrunTestcaseGroup testcaseGroup : targetTestrun.getTestcaseGroups()) {
            TestrunTestcaseGroupDTO updateTestrunTestcaseGroup = testrun.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testcaseGroup.getId())).findAny().orElse(null);
            if (testcaseGroup.getTestcases() != null) {
                testcaseGroup.getTestcases().removeIf(testcase -> {
                    if (updateTestrunTestcaseGroup != null) {
                        return updateTestrunTestcaseGroup.getTestcases().stream().noneMatch(testrunTestcaseGroupTestcaseDTO -> testrunTestcaseGroupTestcaseDTO.getId().equals(testcase.getId()));
                    }

                    return true;
                });
            }
        }

        // 존재하는 테스트런 테스트케이스 그룹에 추가된 테스트런 테이스케이스 추가
        testrun.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).forEach(testrunTestcaseGroupDTO -> {
            TestrunTestcaseGroup targetTestcaseGroup = targetTestrun.getTestcaseGroups().stream().filter(testrunTestcaseGroup -> testrunTestcaseGroup.getId().equals(testrunTestcaseGroupDTO.getId())).findAny().orElse(null);

            if (targetTestcaseGroup != null && testrunTestcaseGroupDTO.getTestcases() != null) {
                testrunTestcaseGroupDTO.getTestcases().stream().filter(testrunTestcaseGroupTestcaseDTO -> testrunTestcaseGroupTestcaseDTO.getId() == null).forEach(testrunTestcaseGroupTestcaseDTO -> {
                    TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = mappingUtil.convert(testrunTestcaseGroupTestcaseDTO, TestrunTestcaseGroupTestcase.class);
                    testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(targetTestcaseGroup);
                    targetTestcaseGroup.getTestcases().add(testrunTestcaseGroupTestcase);
                });
            }
        });

        // 추가된 테스트런 테스트케이스 그룹 추가
        testrun.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() == null).forEach(testrunTestcaseGroupDTO -> {
            TestrunTestcaseGroup testrunTestcaseGroup = mappingUtil.convert(testrunTestcaseGroupDTO, TestrunTestcaseGroup.class);
            testrunTestcaseGroup.setTestrun(targetTestrun);
            targetTestrun.getTestcaseGroups().add(testrunTestcaseGroup);
        });

        // 테스터 설정
        for (TestrunTestcaseGroup testrunTestcaseGroup : targetTestrun.getTestcaseGroups()) {
            testrunTestcaseGroup.setTestrun(targetTestrun);
            if (testrunTestcaseGroup.getTestcases() != null) {
                for (TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                    testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);

                    if (testrunTestcaseGroupTestcase.getId() == null) {
                        TestcaseDTO testcase = testcaseService.selectTestcaseInfo(testrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId());

                        List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();
                        testrunTestcaseGroupTestcase.setTestResult(TestResultCode.UNTESTED);
                        if (!testrunUsers.isEmpty()) {
                            // 테스터 입력
                            if ("tag".equals(testcase.getTesterType())) {
                                if (tagUserMap.containsKey(testcase.getTesterValue())) {
                                    List<ProjectUserDTO> tagUsers = tagUserMap.get(testcase.getTesterValue());
                                    int userIndex = random.nextInt(tagUsers.size());
                                    testrunTestcaseGroupTestcase.setTester(User.builder().id(tagUsers.get(userIndex).getUser().getId()).build());
                                } else {
                                    int userIndex = random.nextInt(testrunUsers.size());
                                    testrunTestcaseGroupTestcase.setTester(User.builder().id(testrunUsers.get(userIndex).getUser().getId()).build());
                                }
                            } else if ("operation".equals(testcase.getTesterType())) {
                                if ("RND".equals(testcase.getTesterValue())) {
                                    int userIndex = random.nextInt(testrunUsers.size());
                                    testrunTestcaseGroupTestcase.setTester(User.builder().id(testrunUsers.get(userIndex).getUser().getId()).build());
                                } else if ("SEQ".equals(testcase.getTesterValue())) {
                                    if (currentSeq > testrunUsers.size() - 1) {
                                        currentSeq = 0;
                                    }

                                    testrunTestcaseGroupTestcase.setTester(User.builder().id(testrunUsers.get(currentSeq).getUser().getId()).build());
                                    currentSeq++;
                                }
                            } else {
                                testrunTestcaseGroupTestcase.setTester(User.builder().id(Long.parseLong(testcase.getTesterValue())).build());
                            }
                        }

                        for (TestcaseItemDTO testcaseItem : testcaseItems) {

                            if (testcaseItem.getValue() == null) {
                                continue;
                            }

                            TestcaseTemplateItem testcaseTemplateItem = mappingUtil.convert(testcaseItem.getTestcaseTemplateItem(), TestcaseTemplateItem.class);

                            if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {

                                TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem.builder().testcaseTemplateItem(testcaseTemplateItem).testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase).type("value").build();

                                if (!testrunUsers.isEmpty()) {
                                    if ("RND".equals(testcaseItem.getValue())) {
                                        int userIndex = random.nextInt(testrunUsers.size());
                                        testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(userIndex).getUser().getId().toString());
                                    } else if ("SEQ".equals(testcaseItem.getValue())) {

                                        if (currentSeq > testrunUsers.size() - 1) {
                                            currentSeq = 0;
                                        }

                                        testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(currentSeq).getUser().getId().toString());

                                        currentSeq++;

                                    } else {
                                        testrunTestcaseGroupTestcaseItem.setValue(testcaseItem.getValue());
                                    }
                                }


                                if (testrunTestcaseGroupTestcase.getTestcaseItems() == null) {
                                    testrunTestcaseGroupTestcase.setTestcaseItems(new ArrayList<>());
                                }
                                testrunTestcaseGroupTestcase.getTestcaseItems().add(testrunTestcaseGroupTestcaseItem);
                            }
                        }
                    } else {
                        // 존재하는 테스트케이스에 테스터가 삭제된 경우 처리

                        TestcaseDTO testcase = testcaseService.selectTestcaseInfo(testrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId());

                        boolean removedUser = testrunUsers.stream().noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunTestcaseGroupTestcase.getTester() != null ? testrunTestcaseGroupTestcase.getTester().getId() : null));

                        if (removedUser) {
                            if (!testrunUsers.isEmpty()) {
                                // 테스터 입력
                                if ("tag".equals(testcase.getTesterType())) {
                                    if (tagUserMap.containsKey(testcase.getTesterValue())) {
                                        List<ProjectUserDTO> tagUsers = tagUserMap.get(testcase.getTesterValue());
                                        int userIndex = random.nextInt(tagUsers.size());
                                        testrunTestcaseGroupTestcase.setTester(User.builder().id(tagUsers.get(userIndex).getUser().getId()).build());
                                    } else {
                                        int userIndex = random.nextInt(testrunUsers.size());
                                        testrunTestcaseGroupTestcase.setTester(User.builder().id(testrunUsers.get(userIndex).getUser().getId()).build());
                                    }
                                } else if ("operation".equals(testcase.getTesterType())) {
                                    if ("RND".equals(testcase.getTesterValue())) {
                                        int userIndex = random.nextInt(testrunUsers.size());
                                        testrunTestcaseGroupTestcase.setTester(User.builder().id(testrunUsers.get(userIndex).getUser().getId()).build());
                                    } else if ("SEQ".equals(testcase.getTesterValue())) {
                                        if (currentSeq > testrunUsers.size() - 1) {
                                            currentSeq = 0;
                                        }

                                        testrunTestcaseGroupTestcase.setTester(User.builder().id(testrunUsers.get(currentSeq).getUser().getId()).build());
                                        currentSeq++;
                                    }
                                } else {
                                    testrunTestcaseGroupTestcase.setTester(User.builder().id(Long.parseLong(testcase.getTesterValue())).build());
                                }
                            } else {
                                testrunTestcaseGroupTestcase.setTester(null);
                            }
                        }


                        List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();
                        for (TestcaseItemDTO testcaseItem : testcaseItems) {

                            if (testcaseItem.getValue() == null) {
                                continue;
                            }

                            TestcaseTemplateItem testcaseTemplateItem = mappingUtil.convert(testcaseItem.getTestcaseTemplateItem(), TestcaseTemplateItem.class);

                            if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {
                                TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = testrunTestcaseGroupTestcase.getTestcaseItems().stream().filter((item -> item.getTestcaseTemplateItem().getId().equals(testcaseTemplateItem.getId()))).findAny().orElse(null);

                                if (testrunTestcaseGroupTestcaseItem != null) {
                                    if (!testrunUsers.isEmpty()) {
                                        if ("RND".equals(testcaseItem.getValue())) {
                                            int userIndex = random.nextInt(testrunUsers.size());
                                            testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(userIndex).getUser().getId().toString());
                                        } else if ("SEQ".equals(testcaseItem.getValue())) {

                                            if (currentSeq > testrunUsers.size() - 1) {
                                                currentSeq = 0;
                                            }

                                            testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(currentSeq).getUser().getId().toString());
                                            currentSeq++;
                                        }
                                    } else {
                                        testrunTestcaseGroupTestcaseItem.setValue(null);
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }


        int totalTestCount = targetTestrun.getTestcaseGroups().stream().map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0).reduce(0, Integer::sum);

        targetTestrun.setTotalTestcaseCount(totalTestCount);

        Testrun result = testrunRepository.save(targetTestrun);
        return new TestrunDTO(result, true);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunReservation.project.id}", value = CacheConfig.PROJECT)
    public TestrunReservationDTO updateTestrunReservationInfo(String spaceCode, TestrunReservationDTO testrunReservation) {

        TestrunReservation targetTestrunReservation = testrunReservationRepository.findById(testrunReservation.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));


        targetTestrunReservation.setExpired(false);
        targetTestrunReservation.setName(testrunReservation.getName());
        targetTestrunReservation.setDescription(testrunReservation.getDescription());
        targetTestrunReservation.setStartDateTime(testrunReservation.getStartDateTime());
        targetTestrunReservation.setEndDateTime(testrunReservation.getEndDateTime());
        targetTestrunReservation.setDeadlineClose(testrunReservation.getDeadlineClose());
        // 삭제된 테스터 제거
        targetTestrunReservation.getTestrunUsers().removeIf((testrunUser -> testrunReservation.getTestrunUsers().stream().noneMatch((testrunUserDTO -> testrunUserDTO.getUser().getId().equals(testrunUser.getUser().getId())))));
        // 추가된 테스터 추가
        targetTestrunReservation.getTestrunUsers()
                .addAll(testrunReservation.getTestrunUsers()
                        .stream()
                        .filter(testrunUserDTO -> targetTestrunReservation.getTestrunUsers()
                                .stream()
                                .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunUserDTO.getUser().getId()))
                        ).map((testrunUserDTO -> TestrunUser.builder()
                                .user(User.builder().id(testrunUserDTO.getUser().getId()).build())
                                .testrunReservation(targetTestrunReservation).build()))
                        .collect(Collectors.toList())
                );

        // 삭제된 테스트런 테스트케이스 그룹 제거
        targetTestrunReservation.getTestcaseGroups().removeIf((testrunTestcaseGroup -> testrunReservation.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).noneMatch((testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testrunTestcaseGroup.getId())))));

        // 삭제된 테스트런 테스트케이스 그룹 테스트케이스 제거
        for (TestrunTestcaseGroup testcaseGroup : targetTestrunReservation.getTestcaseGroups()) {
            TestrunTestcaseGroupDTO updateTestrunTestcaseGroup = testrunReservation.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testcaseGroup.getId())).findAny().orElse(null);
            if (testcaseGroup.getTestcases() != null) {
                testcaseGroup.getTestcases().removeIf(testcase -> {
                    if (updateTestrunTestcaseGroup != null) {
                        return updateTestrunTestcaseGroup.getTestcases().stream().noneMatch(testrunTestcaseGroupTestcaseDTO -> testrunTestcaseGroupTestcaseDTO.getId().equals(testcase.getId()));
                    }

                    return true;
                });
            }
        }

        // 존재하는 테스트런 테스트케이스 그룹에 추가된 테스트런 테이스케이스 추가
        if (testrunReservation.getTestcaseGroups() != null) {

            testrunReservation.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).forEach(testrunTestcaseGroupDTO -> {
                TestrunTestcaseGroup targetTestcaseGroup = targetTestrunReservation.getTestcaseGroups().stream().filter(testrunTestcaseGroup -> testrunTestcaseGroup.getId().equals(testrunTestcaseGroupDTO.getId())).findAny().orElse(null);

                if (targetTestcaseGroup != null && testrunTestcaseGroupDTO.getTestcases() != null) {
                    testrunTestcaseGroupDTO.getTestcases().stream().filter(testrunTestcaseGroupTestcaseDTO -> testrunTestcaseGroupTestcaseDTO.getId() == null).forEach(testrunTestcaseGroupTestcaseDTO -> {
                        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = mappingUtil.convert(testrunTestcaseGroupTestcaseDTO, TestrunTestcaseGroupTestcase.class);
                        testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(targetTestcaseGroup);
                        targetTestcaseGroup.getTestcases().add(testrunTestcaseGroupTestcase);
                    });
                }
            });

            // 추가된 테스트런 테스트케이스 그룹 추가
            testrunReservation.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() == null).forEach(testrunTestcaseGroupDTO -> {
                TestrunTestcaseGroup testrunTestcaseGroup = mappingUtil.convert(testrunTestcaseGroupDTO, TestrunTestcaseGroup.class);
                testrunTestcaseGroup.setTestrunReservation(targetTestrunReservation);
                targetTestrunReservation.getTestcaseGroups().add(testrunTestcaseGroup);
            });
        }

        int testcaseGroupCount = targetTestrunReservation.getTestcaseGroups().size();
        int testcaseCount = targetTestrunReservation.getTestcaseGroups().stream().map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0).reduce(0, Integer::sum);

        targetTestrunReservation.setTestcaseGroupCount(testcaseGroupCount);
        targetTestrunReservation.setTestcaseCount(testcaseCount);

        TestrunReservation result = testrunReservationRepository.save(targetTestrunReservation);
        return new TestrunReservationDTO(result);
    }

    @Transactional
    public void updateTestrunIterationCursor(Long testrunIterationId, Integer filteringUserCursor, List<Long> currentFilteringUserIds) {
        testrunIterationRepository.updateTestrunIterationUserCursor(testrunIterationId, filteringUserCursor, currentFilteringUserIds);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrunIteration.project.id}", value = CacheConfig.PROJECT)
    public TestrunIterationDTO updateTestrunIterationInfo(String spaceCode, TestrunIterationDTO testrunIteration) {

        TestrunIteration targetTestrunIteration = testrunIterationRepository.findById(testrunIteration.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestrunIteration.setExpired(false);
        targetTestrunIteration.setName(testrunIteration.getName());
        targetTestrunIteration.setDescription(testrunIteration.getDescription());
        targetTestrunIteration.setReserveStartDateTime(testrunIteration.getReserveStartDateTime());
        targetTestrunIteration.setReserveEndDateTime(testrunIteration.getReserveEndDateTime());
        targetTestrunIteration.setTestrunIterationTimeType(testrunIteration.getTestrunIterationTimeType());
        targetTestrunIteration.setExcludeHoliday(testrunIteration.getExcludeHoliday());
        targetTestrunIteration.setDurationHours(testrunIteration.getDurationHours());
        targetTestrunIteration.setDays(testrunIteration.getDays());
        targetTestrunIteration.setStartTime(testrunIteration.getStartTime());
        targetTestrunIteration.setDeadlineClose(testrunIteration.getDeadlineClose());
        targetTestrunIteration.setDate(testrunIteration.getDate());
        targetTestrunIteration.setWeek(testrunIteration.getWeek());
        targetTestrunIteration.setDay(testrunIteration.getDay());
        targetTestrunIteration.setTestrunIterationUserFilterType(testrunIteration.getTestrunIterationUserFilterType());
        targetTestrunIteration.setTestrunIterationUserFilterSelectRule(testrunIteration.getTestrunIterationUserFilterSelectRule());
        targetTestrunIteration.setFilteringUserCount(testrunIteration.getFilteringUserCount());
        targetTestrunIteration.setFilteringUserCursor(testrunIteration.getFilteringUserCursor());
        targetTestrunIteration.setCurrentFilteringUserIds(testrunIteration.getCurrentFilteringUserIds());

        // 삭제된 테스터 제거
        targetTestrunIteration.getTestrunUsers().removeIf((testrunUser -> testrunIteration.getTestrunUsers().stream().noneMatch((testrunUserDTO -> testrunUserDTO.getUser().getId().equals(testrunUser.getUser().getId())))));
        // 추가된 테스터 추가
        targetTestrunIteration.getTestrunUsers()
                .addAll(testrunIteration.getTestrunUsers()
                        .stream()
                        .filter(testrunUserDTO -> targetTestrunIteration.getTestrunUsers()
                                .stream()
                                .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunUserDTO.getUser().getId()))
                        ).map((testrunUserDTO -> TestrunUser.builder()
                                .user(User.builder().id(testrunUserDTO.getUser().getId()).build())
                                .testrunIteration(targetTestrunIteration).build()))
                        .collect(Collectors.toList())
                );

        // 삭제된 테스트런 테스트케이스 그룹 제거
        targetTestrunIteration.getTestcaseGroups().removeIf((testrunTestcaseGroup -> testrunIteration.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).noneMatch((testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testrunTestcaseGroup.getId())))));

        // 삭제된 테스트런 테스트케이스 그룹 테스트케이스 제거
        for (TestrunTestcaseGroup testcaseGroup : targetTestrunIteration.getTestcaseGroups()) {
            TestrunTestcaseGroupDTO updateTestrunTestcaseGroup = testrunIteration.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testcaseGroup.getId())).findAny().orElse(null);
            if (testcaseGroup.getTestcases() != null) {
                testcaseGroup.getTestcases().removeIf(testcase -> {
                    if (updateTestrunTestcaseGroup != null) {
                        return updateTestrunTestcaseGroup.getTestcases().stream().noneMatch(testrunTestcaseGroupTestcaseDTO -> testrunTestcaseGroupTestcaseDTO.getId().equals(testcase.getId()));
                    }

                    return true;
                });
            }
        }

        // 존재하는 테스트런 테스트케이스 그룹에 추가된 테스트런 테이스케이스 추가
        testrunIteration.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null).forEach(testrunTestcaseGroupDTO -> {
            TestrunTestcaseGroup targetTestcaseGroup = targetTestrunIteration.getTestcaseGroups().stream().filter(testrunTestcaseGroup -> testrunTestcaseGroup.getId().equals(testrunTestcaseGroupDTO.getId())).findAny().orElse(null);

            if (targetTestcaseGroup != null && testrunTestcaseGroupDTO.getTestcases() != null) {
                testrunTestcaseGroupDTO.getTestcases().stream().filter(testrunTestcaseGroupTestcaseDTO -> testrunTestcaseGroupTestcaseDTO.getId() == null).forEach(testrunTestcaseGroupTestcaseDTO -> {
                    TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = mappingUtil.convert(testrunTestcaseGroupTestcaseDTO, TestrunTestcaseGroupTestcase.class);
                    testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(targetTestcaseGroup);
                    targetTestcaseGroup.getTestcases().add(testrunTestcaseGroupTestcase);
                });
            }
        });

        // 추가된 테스트런 테스트케이스 그룹 추가
        testrunIteration.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() == null).forEach(testrunTestcaseGroupDTO -> {
            TestrunTestcaseGroup testrunTestcaseGroup = mappingUtil.convert(testrunTestcaseGroupDTO, TestrunTestcaseGroup.class);
            testrunTestcaseGroup.setTestrunIteration(targetTestrunIteration);
            targetTestrunIteration.getTestcaseGroups().add(testrunTestcaseGroup);
        });

        int testcaseGroupCount = targetTestrunIteration.getTestcaseGroups().size();
        int testcaseCount = targetTestrunIteration.getTestcaseGroups().stream().map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0).reduce(0, Integer::sum);

        targetTestrunIteration.setTestcaseGroupCount(testcaseGroupCount);
        targetTestrunIteration.setTestcaseCount(testcaseCount);

        List<Long> currentFilteringUserIds = targetTestrunIteration.getCurrentFilteringUserIds();
        if (currentFilteringUserIds != null) {
            currentFilteringUserIds.removeIf((userId) -> testrunIteration.getTestrunUsers().stream().noneMatch((testrunUserDTO -> testrunUserDTO.getUser().getId().equals(userId))));
        }

        TestrunIteration result = testrunIterationRepository.save(targetTestrunIteration);
        return new TestrunIterationDTO(result);
    }

    private Map<String, List<ProjectUserDTO>> getTagUserMap(ProjectDTO project, List<TestrunUser> testrunUsers) {
        Map<String, List<ProjectUserDTO>> tagUserMap = new HashMap<>();
        project.getUsers().forEach((projectUserDTO -> {
            String tagString = projectUserDTO.getTags();
            if (tagString != null) {
                String[] tags = tagString.split(";");
                if (tags.length > 0) {
                    Arrays.stream(tags).forEach((tag) -> {
                        if (tag.length() > 0) {
                            if (!tagUserMap.containsKey(tag)) {
                                tagUserMap.put(tag, new ArrayList<>());
                            }

                            List<ProjectUserDTO> users = tagUserMap.get(tag);
                            if (testrunUsers.stream().anyMatch(testrunUser -> testrunUser.getUser().getId().equals(projectUserDTO.getUser().getId()))) {
                                users.add(projectUserDTO);
                            }
                        }
                    });
                }
            }
        }));

        tagUserMap.keySet().removeIf(key -> tagUserMap.get(key).size() < 1);
        return tagUserMap;
    }

    public List<TestrunDTO> selectUserAssignedTestrunList(String spaceCode, long projectId, Long userId) {
        List<Testrun> testruns = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(spaceCode, projectId, true);

        List<Testrun> list = testruns.stream()
                .filter(
                        (testrun -> testrun.getTestcaseGroups()
                                .stream()
                                .anyMatch(
                                        (testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases()
                                                .stream()
                                                .anyMatch(
                                                        (testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId()))
                                                ))
                                ))
                )
                .map((testrun -> {
                    List<TestrunTestcaseGroup> userTestcaseGroupList = testrun.getTestcaseGroups().stream().filter(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream().anyMatch((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId())))).map((testrunTestcaseGroup -> {
                        List<TestrunTestcaseGroupTestcase> userTestcaseList = testrunTestcaseGroup.getTestcases().stream().filter((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId()))).collect(Collectors.toList());
                        testrunTestcaseGroup.setTestcases(userTestcaseList);
                        return testrunTestcaseGroup;
                    })).collect(Collectors.toList());
                    testrun.setTestcaseGroups(userTestcaseGroupList);
                    return testrun;
                })).collect(Collectors.toList());

        return list.stream().map(testrun -> new TestrunDTO(testrun, true)).collect(Collectors.toList());

    }

    @Transactional
    public TestrunParticipantDTO createTestrunParticipantInfo(String spaceCode, Long projectId, Long testrunId, UserDTO user) {
        TestrunParticipant participant = TestrunParticipant.builder()
                .id(spaceCode + "-" + spaceCode + "-" + testrunId + "-" + user.getId())
                .spaceCode(spaceCode)
                .projectId(projectId)
                .testrunId(testrunId)
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .build();

        return new TestrunParticipantDTO(testrunParticipantRedisRepository.save(participant));

    }

    @Transactional
    public void deleteTestrunParticipantInfo(String spaceCode, Long projectId, Long testrunId, Long userId) {
        testrunParticipantRedisRepository.deleteById((spaceCode + "-" + projectId + "-" + testrunId + "-" + userId));

    }

    @Transactional
    public void deleteTestrunParticipantInfo(TestrunParticipantDTO testrunParticipantDTO) {
        Optional<TestrunParticipant> participant = testrunParticipantRedisRepository.findById(testrunParticipantDTO.getId());
        if (participant.isPresent()) {
            testrunParticipantRedisRepository.delete(participant.get());
        }
    }


    public List<TestrunParticipantDTO> selectTestrunParticipantList(String spaceCode, Long projectId, Long testrunId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository.findAllBySpaceCodeAndProjectIdAndTestrunId(spaceCode, projectId, testrunId);

        return testrunParticipants.stream()
                .map(TestrunParticipantDTO::new)
                .collect(Collectors.toList());
    }

    public List<TestrunParticipantDTO> selectTestrunParticipantList(Long testrunId, Long userId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository.findAllByTestrunIdAndUserId(testrunId, userId);

        return testrunParticipants.stream()
                .map(TestrunParticipantDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTestrunTestcaseGroup(long testcaseGroupId) {
        testrunTestcaseGroupRepository.deleteByTestcaseGroupId(testcaseGroupId);
    }

    public List<Long> selectTestcaseIncludeTestrunList(String projectToken, Long testcaseSeqNumber) {
        Long projectId = projectService.selectProjectId(projectToken);
        return testrunRepository.findAllByProjectIdAndTestcaseSeqId(projectId, "TC" + testcaseSeqNumber);
    }

    public List<TestrunTestcaseGroupDTO> selectConditionalTestcaseGroups(TestrunReservationDTO testrunReservationDTO, LocalDateTime now, List<TestrunTestcaseGroupDTO> pTestcaseGroups, Map<Long, ArrayList<Long>> testcaseGroupIdMap, TestrunDTO testrun) {

        List<TestrunTestcaseGroupDTO> testcaseGroups = pTestcaseGroups == null ? new ArrayList<>() : pTestcaseGroups;

        List<TestcaseDTO> conditionalTestcaseList = new ArrayList<>();
        Map<Long, Boolean> conditionalTestcaseIdMap = new HashMap<>();
        if (testrunReservationDTO.getSelectCreatedTestcase() != null && testrunReservationDTO.getSelectCreatedTestcase()) {

            List<TestcaseDTO> createdTestcaseList = testcaseService.selectTestcaseItemListByCreationTime(testrunReservationDTO.getProject().getId(), testrunReservationDTO.getCreationDate(), now);
            for (TestcaseDTO testcaseDTO : createdTestcaseList) {
                conditionalTestcaseList.add(testcaseDTO);
                conditionalTestcaseIdMap.put(testcaseDTO.getId(), true);
            }
        }

        if (testrunReservationDTO.getSelectUpdatedTestcase() != null && testrunReservationDTO.getSelectUpdatedTestcase()) {
            List<TestcaseDTO> updateDateTestcaseList = testcaseService.selectTestcaseItemListByContentUpdateDate(testrunReservationDTO.getProject().getId(), testrunReservationDTO.getCreationDate(), now);

            for (TestcaseDTO testcaseDTO : updateDateTestcaseList) {
                if (!conditionalTestcaseIdMap.containsKey(testcaseDTO.getId())) {
                    conditionalTestcaseList.add(testcaseDTO);
                    conditionalTestcaseIdMap.put(testcaseDTO.getId(), true);
                }
            }
        }

        if (conditionalTestcaseList.size() > 0) {

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
                    TestrunTestcaseGroupDTO testcaseGroup = testcaseGroups.stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getTestcaseGroup().getId().equals(testcaseGroupId)).findFirst().orElse(null);
                    if (testcaseGroup != null) {

                        TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcaseDTO = TestrunTestcaseGroupTestcaseDTO
                                .builder()
                                .testrunTestcaseGroup(testcaseGroup)
                                .testcase(testcaseDTO)
                                .build();

                        testrunTestcaseGroupTestcaseDTO
                                .setTestcaseItems(testcaseDTO.getTestcaseItems()
                                        .stream()
                                        .map(testcaseItemDTO -> {
                                            return TestrunTestcaseGroupTestcaseItemDTO
                                                    .builder()
                                                    .testcaseTemplateItem(testcaseItemDTO.getTestcaseTemplateItem())
                                                    .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcaseDTO)
                                                    .type(testcaseItemDTO.getType())
                                                    .value(testcaseItemDTO.getValue())
                                                    .text(testcaseItemDTO.getText())
                                                    .build();
                                        }).collect(Collectors.toList()));

                        testcaseGroup.getTestcases().add(testrunTestcaseGroupTestcaseDTO);
                        testcaseIds.add(testcaseId);
                    }
                }
            });
        }

        return testcaseGroups;

    }


}
