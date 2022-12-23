package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.entity.*;
import com.mindplates.bugcase.biz.testrun.repository.*;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
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

    public TestrunTestcaseGroupTestcase selectTestrunTestcaseGroupTestcaseInfo(long testrunTestcaseGroupTestcaseId) {
        return testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }


    public List<Testrun> selectProjectTestrunList(String spaceCode, long projectId, String status) {

        if ("ALL".equals(status)) {
            return testrunRepository.findAllByProjectSpaceCodeAndProjectIdOrderByEndDateTimeDescIdDesc(spaceCode, projectId);
        }

        return testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByEndDateTimeDescIdDesc(spaceCode, projectId, "OPENED".equals(status));

    }

    public Testrun selectProjectTestrunInfo(long testrunId) {
        return testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectTestrunInfo(String spaceCode, long projectId, long testrunId) {
        testrunTestcaseGroupTestcaseItemRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupTestcaseRepository.deleteByTestrunId(testrunId);
        testrunUserRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupRepository.deleteByTestrunId(testrunId);
        testrunTestcaseGroupTestcaseCommentRepository.deleteByTestrunId(testrunId);
        testrunRepository.deleteById(testrunId);

    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void updateProjectTestrunStatusClosed(String spaceCode, long projectId, long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrun.setOpened(false);
        testrunRepository.save(testrun);
    }

    @Transactional
    public List<TestrunTestcaseGroupTestcaseItem> updateTestrunTestcaseGroupTestcaseItems(List<TestrunTestcaseGroupTestcaseItem> testrunTestcaseGroupTestcaseItems) {
        return testrunTestcaseGroupTestcaseItemRepository.saveAll(testrunTestcaseGroupTestcaseItems);
    }

    @Transactional
    public void updateTestrunTestcaseResult(long testrunId, Long testrunTestcaseGroupTestcaseId, TestResultCode testResultCode) {

        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = testrunTestcaseGroupTestcaseRepository.findById(testrunTestcaseGroupTestcaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (testrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.PASSED)) {
            testrun.setPassedTestcaseCount(testrun.getPassedTestcaseCount() - 1);
        } else if (testrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.FAILED)) {
            testrun.setFailedTestcaseCount(testrun.getFailedTestcaseCount() - 1);
        }

        if (testResultCode.equals(TestResultCode.PASSED)) {
            testrun.setPassedTestcaseCount(testrun.getPassedTestcaseCount() + 1);
        } else if (testResultCode.equals(TestResultCode.FAILED)) {
            testrun.setFailedTestcaseCount(testrun.getFailedTestcaseCount() + 1);
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
    public TestrunTestcaseGroupTestcaseComment updateTestrunTestcaseGroupTestcaseComment(TestrunTestcaseGroupTestcaseComment testrunTestcaseGroupTestcaseComment) {
        testrunTestcaseGroupTestcaseCommentRepository.save(testrunTestcaseGroupTestcaseComment);
        return testrunTestcaseGroupTestcaseComment;
    }

    @Transactional
    public void deleteTestrunTestcaseGroupTestcaseComment(Long testrunTestcaseGroupTestcaseCommentId) {
        testrunTestcaseGroupTestcaseCommentRepository.deleteById(testrunTestcaseGroupTestcaseCommentId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#testrun.project.id}", value = CacheConfig.PROJECT)
    public Testrun createTestrunInfo(String spaceCode, Testrun testrun) {

        Project project = projectService.selectProjectInfo(spaceCode, testrun.getProject().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int currentTestrunSeq = (project.getTestrunSeq() == null ? 0 : project.getTestrunSeq()) + 1;
        project.setTestrunSeq(currentTestrunSeq);
        projectService.updateProjectInfo(spaceCode, project);

        testrun.setSeqId("R" + currentTestrunSeq);
        testrun.setOpened(true);

        int totalTestCount = testrun.getTestcaseGroups().stream()
                .map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0)
                .reduce(0, Integer::sum);

        List<TestrunUser> testrunUsers = testrun.getTestrunUsers();

        Random random = new Random();
        int currentSeq = random.nextInt(testrunUsers.size());
        for (TestrunTestcaseGroup testrunTestcaseGroup : testrun.getTestcaseGroups()) {
            List<TestrunTestcaseGroupTestcase> testcases = testrunTestcaseGroup.getTestcases();
            for (TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase : testcases) {
                // Testcase testcase = testrunTestcaseGroupTestcase.getTestcase();

                Testcase testcase = testcaseService.selectTestcaseInfo(testrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
                List<TestcaseItem> testcaseItems = testcase.getTestcaseItems();
                testrunTestcaseGroupTestcase.setTestResult(TestResultCode.UNTESTED);
                // 테스터 입력
                if ("operation".equals(testcase.getTesterType())) {
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

                for (TestcaseItem testcaseItem : testcaseItems) {

                    if (testcaseItem.getValue() == null) {
                        continue;
                    }

                    TestcaseTemplateItem testcaseTemplateItem = testcaseItem.getTestcaseTemplateItem();

                    if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {

                        TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem
                                .builder()
                                .testcaseTemplateItem(testcaseTemplateItem)
                                .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase)
                                .type("value")
                                .build();

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

        testrun.setTotalTestcaseCount(totalTestCount);
        testrun.setPassedTestcaseCount(0);
        testrun.setFailedTestcaseCount(0);

        testrunRepository.save(testrun);
        return testrun;
    }

    public List<Testrun> selectUserAssignedTestrunList(String spaceCode, long projectId, Long userId) {

        List<Testrun> testruns = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByEndDateTimeDescIdDesc(spaceCode, projectId, true);


        return testruns.stream()
                .filter((testrun -> testrun.getTestcaseGroups()
                        .stream()
                        .anyMatch((testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream().anyMatch((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId()))))))).map((testrun -> {
            List<TestrunTestcaseGroup> userTestcaseGroupList = testrun.getTestcaseGroups().stream()
                    .filter(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases().stream().anyMatch((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId()))))
                    .map((testrunTestcaseGroup -> {
                        List<TestrunTestcaseGroupTestcase> userTestcaseList = testrunTestcaseGroup.getTestcases().stream().filter((testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester().getId()))).collect(Collectors.toList());
                        testrunTestcaseGroup.setTestcases(userTestcaseList);
                        return testrunTestcaseGroup;
                    })).collect(Collectors.toList());
            testrun.setTestcaseGroups(userTestcaseGroupList);
            return testrun;
        })).collect(Collectors.toList());

    }

}
