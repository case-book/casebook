package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.dto.*;
import com.mindplates.bugcase.biz.testrun.entity.*;
import com.mindplates.bugcase.biz.testrun.repository.*;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.code.TestrunCreationTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
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
@AllArgsConstructor
public class TestrunService {

    private final TestrunRepository testrunRepository;

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

    public TestrunTestcaseGroupTestcaseDTO selectTestrunTestcaseGroupTestcaseInfo(long testrunTestcaseGroupTestcaseId) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunTestcaseGroupTestcaseDTO(testrunTestcaseGroupTestcase);
    }


    public List<TestrunDTO> selectProjectTestrunList(String spaceCode, long projectId, String status, TestrunCreationTypeCode creationTypeCode) {

        List<Testrun> list;
        if ("ALL".equals(status)) {
            list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndCreationTypeOrderByEndDateTimeDescIdDesc(spaceCode, projectId, creationTypeCode);
        } else {
            list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedAndCreationTypeOrderByEndDateTimeDescIdDesc(spaceCode, projectId, "OPENED".equals(status), creationTypeCode);
        }

        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());

    }

    public List<TestrunDTO> selectProjectReserveTestrunList(String spaceCode, long projectId, TestrunCreationTypeCode creationTypeCode) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndCreationTypeOrderByEndDateTimeDescIdDesc(spaceCode, projectId, creationTypeCode);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectReserveTestrunList() {
        List<Testrun> list = testrunRepository.findAllByCreationTypeNotAndReserveExpiredIsNullOrCreationTypeNotAndReserveExpiredIsFalse(TestrunCreationTypeCode.CREATE, TestrunCreationTypeCode.CREATE);
        return list.stream().map((testrun -> new TestrunDTO(testrun, true))).collect(Collectors.toList());
    }

    public List<TestrunDTO> selectProjectAllTestrunList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdOrderByEndDateTimeDescIdDesc(spaceCode, projectId);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());

    }

    public Long selectProjectOpenedTestrunCount(String spaceCode, long projectId, TestrunCreationTypeCode creationTypeCode) {
        return testrunRepository.countByProjectSpaceCodeAndProjectIdAndCreationTypeAndOpenedTrue(spaceCode, projectId, creationTypeCode);
    }

    public Long selectProjectOpenedTestrunCount(Long spaceId, long projectId, TestrunCreationTypeCode creationTypeCode) {
        return testrunRepository.countByProjectSpaceIdAndProjectIdAndCreationTypeAndOpenedTrue(spaceId, projectId, creationTypeCode);
    }

    public List<TestrunDTO> selectProjectTestrunHistoryList(String spaceCode, long projectId, LocalDateTime start, LocalDateTime end) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByEndDateTimeDescIdDesc(spaceCode, projectId, start, end);
        return list.stream().map(TestrunDTO::new).collect(Collectors.toList());
    }

    public TestrunDTO selectProjectTestrunInfo(long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunDTO(testrun, true);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectTestrunInfo(String spaceCode, long projectId, long testrunId) {

        List<ProjectFile> files = projectFileRepository.findAllByProjectIdAndFileSourceTypeAndFileSourceId(projectId, FileSourceTypeCode.TESTRUN, testrunId);

        projectFileRepository.deleteByProjectFileSourceId(projectId, FileSourceTypeCode.TESTRUN, testrunId);
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupTestcaseRepository.deleteByTestrunId(testrunId);
        testrunUserRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestrunId(testrunId);
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
    public void updateProjectTestrunStatusClosed(String spaceCode, long projectId, long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrun.setOpened(false);
        testrun.setClosedDate(LocalDateTime.now());
        testrunRepository.save(testrun);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateProjectTestrunStatusOpened(String spaceCode, long projectId, long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrun.setOpened(true);
        testrun.setClosedDate(LocalDateTime.now());
        testrunRepository.save(testrun);
    }

    @Transactional
    public List<TestrunTestcaseGroupTestcaseItemDTO> updateTestrunTestcaseGroupTestcaseItems(List<TestrunTestcaseGroupTestcaseItemDTO> testrunTestcaseGroupTestcaseItems) {
        List<TestrunTestcaseGroupTestcaseItem> result = testrunTestcaseGroupTestcaseItemRepository.saveAll(mappingUtil.convert(testrunTestcaseGroupTestcaseItems, TestrunTestcaseGroupTestcaseItem.class));
        return result.stream().map(TestrunTestcaseGroupTestcaseItemDTO::new).collect(Collectors.toList());
        // return mappingUtil.convert(result, TestrunTestcaseGroupTestcaseItemDTO.class);
    }

    @Transactional
    public TestrunTestcaseGroupTestcaseItemDTO updateTestrunTestcaseGroupTestcaseItem(TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItem) {
        TestrunTestcaseGroupTestcaseItem result = testrunTestcaseGroupTestcaseItemRepository.save(mappingUtil.convert(testrunTestcaseGroupTestcaseItem, TestrunTestcaseGroupTestcaseItem.class));
        return new TestrunTestcaseGroupTestcaseItemDTO(result);
        //return mappingUtil.convert(result, TestrunTestcaseGroupTestcaseItemDTO.class);
    }

    @Transactional
    public void updateTestrunTestcaseResult(long testrunId, Long testrunTestcaseGroupTestcaseId, TestResultCode testResultCode) {

        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (testrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.PASSED)) {
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

        testrunTestcaseGroupTestcase.setTestResult(testResultCode);
        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
        testrunRepository.save(testrun);
    }

    @Transactional
    public void updateTestrunTestcaseTester(Long testrunTestcaseGroupTestcaseId, Long testerId) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrunTestcaseGroupTestcase.setTester(User.builder().id(testerId).build());
        testrunTestcaseGroupTestcaseRepository.save(testrunTestcaseGroupTestcase);
    }

    @Transactional
    public TestrunTestcaseGroupTestcaseCommentDTO updateTestrunTestcaseGroupTestcaseComment(TestrunTestcaseGroupTestcaseCommentDTO testrunTestcaseGroupTestcaseComment) {
        TestrunTestcaseGroupTestcaseComment comment = testrunTestcaseGroupTestcaseCommentRepository.save(mappingUtil.convert(testrunTestcaseGroupTestcaseComment, TestrunTestcaseGroupTestcaseComment.class));
        return new TestrunTestcaseGroupTestcaseCommentDTO(comment);
        // return mappingUtil.convert(comment, TestrunTestcaseGroupTestcaseCommentDTO.class);
    }

    @Transactional
    public void deleteTestrunTestcaseGroupTestcaseComment(Long testrunTestcaseGroupTestcaseCommentId) {
        testrunTestcaseGroupTestcaseCommentRepository.deleteById(testrunTestcaseGroupTestcaseCommentId);
    }

    @Transactional
    public void updateTestrunReserveExpired(Long testrunId, Boolean reserveExpired, Long reserveResultId) {
        testrunRepository.updateTestrunReserveExpired(testrunId, reserveExpired, reserveResultId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrun.project.id}", value = CacheConfig.PROJECT)
    public TestrunDTO createTestrunInfo(String spaceCode, TestrunDTO testrun) {

        ProjectDTO project = projectService.selectProjectInfo(spaceCode, testrun.getProject().getId());
        if (TestrunCreationTypeCode.CREATE.equals(testrun.getCreationType())) {
            int currentTestrunSeq = (project.getTestrunSeq() == null ? 0 : project.getTestrunSeq()) + 1;
            project.setTestrunSeq(currentTestrunSeq);
            projectService.updateProjectInfo(spaceCode, project);
            testrun.setSeqId("R" + currentTestrunSeq);
        }

        testrun.setOpened(true);

        int totalTestCount = testrun.getTestcaseGroups().stream().map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0).reduce(0, Integer::sum);

        List<TestrunUserDTO> testrunUsers = testrun.getTestrunUsers();

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
                            if (testrunUsers.stream().anyMatch(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(projectUserDTO.getUser().getId()))) {
                                users.add(projectUserDTO);
                            }
                        }
                    });
                }
            }
        }));

        tagUserMap.keySet().removeIf(key -> tagUserMap.get(key).size() < 1);

        Random random = new Random();
        int currentSeq = random.nextInt(testrunUsers.size());
        for (TestrunTestcaseGroupDTO testrunTestcaseGroup : testrun.getTestcaseGroups()) {
            testrunTestcaseGroup.setTestrun(testrun);
            if (testrunTestcaseGroup.getTestcases() != null) {
                for (TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                    // Testcase testcase = testrunTestcaseGroupTestcase.getTestcase();

                    testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);

                    // 여기서 부터 문제
                    TestcaseDTO testcase = testcaseService.selectTestcaseInfo(testrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId());

                    List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();
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

                        TestcaseTemplateItemDTO testcaseTemplateItem = testcaseItem.getTestcaseTemplateItem();

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

        testrun.setTotalTestcaseCount(totalTestCount);
        testrun.setPassedTestcaseCount(0);
        testrun.setFailedTestcaseCount(0);
        testrun.setUntestableTestcaseCount(0);

        Testrun result = testrunRepository.save(mappingUtil.convert(testrun, Testrun.class));
        return new TestrunDTO(result, true);
        // return mappingUtil.convert(result, TestrunDTO.class);
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
        targetTestrun.setOnHoliday(testrun.getOnHoliday());
        targetTestrun.setStartTime(testrun.getStartTime());
        targetTestrun.setDurationHours(testrun.getDurationHours());
        targetTestrun.setReserveExpired(testrun.getReserveExpired());
        // 삭제된 테스트 제거
        targetTestrun.getTestrunUsers().removeIf((testrunUser -> testrun.getTestrunUsers().stream().noneMatch((testrunUserDTO -> testrunUserDTO.getUser().getId().equals(testrunUser.getUser().getId())))));
        // 추가된 테스터 추가
        targetTestrun.getTestrunUsers().addAll(testrun.getTestrunUsers().stream().filter((testrunUserDTO -> testrunUserDTO.getId() == null)).map((testrunUserDTO -> TestrunUser.builder().user(User.builder().id(testrunUserDTO.getUser().getId()).build()).testrun(targetTestrun).build())).collect(Collectors.toList()));

        List<TestrunUser> testrunUsers = targetTestrun.getTestrunUsers();
        Map<String, List<ProjectUserDTO>> tagUserMap = getTagUserMap(project, testrunUsers);

        Random random = new Random();
        int currentSeq = random.nextInt(testrunUsers.size());

        // 삭제된 테스트런 테스트케이스 그룹 제거
        targetTestrun.getTestcaseGroups().removeIf((testrunTestcaseGroup -> testrun.getTestcaseGroups().stream().noneMatch((testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testrunTestcaseGroup.getId())))));
        // 삭제된 테스트런 테스트케이스 그룹 테스트케이스 제거
        for (TestrunTestcaseGroup testcaseGroup : targetTestrun.getTestcaseGroups()) {
            TestrunTestcaseGroupDTO updateTestrunTestcaseGroup = testrun.getTestcaseGroups().stream().filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testcaseGroup.getId())).findAny().orElse(null);
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

                        for (TestcaseItemDTO testcaseItem : testcaseItems) {

                            if (testcaseItem.getValue() == null) {
                                continue;
                            }

                            TestcaseTemplateItem testcaseTemplateItem = mappingUtil.convert(testcaseItem.getTestcaseTemplateItem(), TestcaseTemplateItem.class);

                            if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {

                                TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem.builder().testcaseTemplateItem(testcaseTemplateItem).testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase).type("value").build();

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
                    } else {
                        // 존재하는 테스트케이스에 테스터가 삭제된 경우 처리

                        TestcaseDTO testcase = testcaseService.selectTestcaseInfo(testrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId());

                        boolean removedUser = testrunUsers.stream().noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunTestcaseGroupTestcase.getTester() != null ? testrunTestcaseGroupTestcase.getTester().getId() : null));

                        if (removedUser) {
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


                        List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();
                        for (TestcaseItemDTO testcaseItem : testcaseItems) {

                            if (testcaseItem.getValue() == null) {
                                continue;
                            }

                            TestcaseTemplateItem testcaseTemplateItem = mappingUtil.convert(testcaseItem.getTestcaseTemplateItem(), TestcaseTemplateItem.class);

                            if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {


                                TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = testrunTestcaseGroupTestcase.getTestcaseItems().stream().filter((item -> item.getTestcaseTemplateItem().getId().equals(testcaseTemplateItem.getId()))).findAny().orElse(null);

                                // TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem.builder().testcaseTemplateItem(testcaseTemplateItem).testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase).type("value").build();

                                if (testrunTestcaseGroupTestcaseItem != null) {
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
        List<Testrun> testruns = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedAndCreationTypeOrderByEndDateTimeDescIdDesc(spaceCode, projectId, true, TestrunCreationTypeCode.CREATE);

        List<Testrun> list = testruns.stream().filter((testrun -> testrun.getTestcaseGroups().stream().anyMatch((testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream().anyMatch((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId()))))))).map((testrun -> {
            List<TestrunTestcaseGroup> userTestcaseGroupList = testrun.getTestcaseGroups().stream().filter(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream().anyMatch((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId())))).map((testrunTestcaseGroup -> {
                List<TestrunTestcaseGroupTestcase> userTestcaseList = testrunTestcaseGroup.getTestcases().stream().filter((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId()))).collect(Collectors.toList());
                testrunTestcaseGroup.setTestcases(userTestcaseList);
                return testrunTestcaseGroup;
            })).collect(Collectors.toList());
            testrun.setTestcaseGroups(userTestcaseGroupList);
            return testrun;
        })).collect(Collectors.toList());

        return list.stream().map(testrun -> new TestrunDTO(testrun, true)).collect(Collectors.toList());
        // return mappingUtil.convert(list, TestrunDTO.class);

    }

}
