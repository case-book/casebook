package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.entity.*;
import com.mindplates.bugcase.biz.testrun.repository.TestrunRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseItemRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@AllArgsConstructor
public class TestrunService {

    private final TestrunRepository testrunRepository;

    private final TestcaseService testcaseService;

    private final ProjectService projectService;

    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;

    private final TestrunTestcaseGroupTestcaseItemRepository testrunTestcaseGroupTestcaseItemRepository;

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

    public void deleteProjectTestrunInfo(long testrunId) {
        testrunRepository.deleteById(testrunId);
    }

    public void updateProjectTestrunStatusClosed(long testrunId) {
        Testrun testrun = testrunRepository.findById(testrunId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        testrun.setOpened(false);
        testrunRepository.save(testrun);
    }

    public void updateTestrunTestcaseGroupTestcaseItems(List<TestrunTestcaseGroupTestcaseItem> testrunTestcaseGroupTestcaseItems) {
        testrunTestcaseGroupTestcaseItemRepository.saveAll(testrunTestcaseGroupTestcaseItems);
    }

    public Testrun createTestrunInfo(String spaceCode, Testrun testrun) {

        Project project = projectService.selectProjectInfo(spaceCode, testrun.getProject().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int currentTestrunSeq = project.getTestrunSeq() + 1;
        project.setTestrunSeq(currentTestrunSeq);
        projectService.updateProjectInfo(spaceCode, project);

        testrun.setSeqId("R" + currentTestrunSeq);
        testrun.setOpened(true);

        int totalTestCount = testrun.getTestcaseGroups().stream()
                .map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0)
                .reduce(0, Integer::sum);

        List<TestrunUser> testrunUsers = testrun.getTestrunUsers();

        Random random = new Random();
        int currentSeq = 0;
        for (TestrunTestcaseGroup testrunTestcaseGroup : testrun.getTestcaseGroups()) {
            List<TestrunTestcaseGroupTestcase> testcases = testrunTestcaseGroup.getTestcases();
            for (TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase : testcases) {
                // Testcase testcase = testrunTestcaseGroupTestcase.getTestcase();

                Testcase testcase = testcaseService.selectTestcaseInfo(testrun.getProject().getId(), testrunTestcaseGroupTestcase.getTestcase().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
                List<TestcaseItem> testcaseItems = testcase.getTestcaseItems();

                for (TestcaseItem testcaseItem : testcaseItems) {

                    TestcaseTemplateItem testcaseTemplateItem = testcaseItem.getTestcaseTemplateItem();

                    if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {

                        if ("RND".equals(testcaseItem.getValue())) {

                            int userIndex = random.nextInt(testrunUsers.size());
                            TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem
                                    .builder()
                                    .testcaseTemplateItem(testcaseTemplateItem)
                                    .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase)
                                    .type("value")
                                    .value(testrunUsers.get(userIndex).getUser().getId().toString())
                                    .build();

                            if (testrunTestcaseGroupTestcase.getTestcaseItems() == null) {
                                testrunTestcaseGroupTestcase.setTestcaseItems(new ArrayList<>());
                            }
                            testrunTestcaseGroupTestcase.getTestcaseItems().add(testrunTestcaseGroupTestcaseItem);


                        } else if ("SEQ".equals(testcaseItem.getValue())) {

                            if (currentSeq > testrunUsers.size() - 1) {
                                currentSeq = 0;
                            }

                            TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem
                                    .builder()
                                    .testcaseTemplateItem(testcaseTemplateItem)
                                    .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase)
                                    .type("value")
                                    .value(testrunUsers.get(currentSeq).getUser().getId().toString())
                                    .build();
                            if (testrunTestcaseGroupTestcase.getTestcaseItems() == null) {
                                testrunTestcaseGroupTestcase.setTestcaseItems(new ArrayList<>());
                            }
                            testrunTestcaseGroupTestcase.getTestcaseItems().add(testrunTestcaseGroupTestcaseItem);

                            currentSeq++;

                        }
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

}
