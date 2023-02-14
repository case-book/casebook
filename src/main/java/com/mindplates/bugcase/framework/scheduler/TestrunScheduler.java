package com.mindplates.bugcase.framework.scheduler;

import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.common.code.TestrunCreationTypeCode;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@Slf4j
@AllArgsConstructor
public class TestrunScheduler {

    private final TestrunService testrunService;

    private void clearTestrun(TestrunDTO testrunDTO) {
        testrunDTO.setId(null);
        testrunDTO.setCreationType(TestrunCreationTypeCode.CREATE);
        if (testrunDTO.getTestrunUsers() != null) {
            for (TestrunUserDTO testrunUser : testrunDTO.getTestrunUsers()) {
                testrunUser.setId(null);
                testrunUser.setTestrun(testrunDTO);
            }
        }

        if (testrunDTO.getTestcaseGroups() != null) {
            testrunDTO.getTestcaseGroups().forEach((testrunTestcaseGroupDTO -> {
                testrunTestcaseGroupDTO.setId(null);
                testrunTestcaseGroupDTO.setTestrun(testrunDTO);
                for (TestrunTestcaseGroupTestcaseDTO testcase : testrunTestcaseGroupDTO.getTestcases()) {
                    testcase.setId(null);
                    testcase.setTestrunTestcaseGroup(testrunTestcaseGroupDTO);
                    for (TestrunTestcaseGroupTestcaseItemDTO testcaseItem : testcase.getTestcaseItems()) {
                        testcaseItem.setId(null);
                    }
                    testcase.getTester().setId(null);
                }
            }));
        }
    }

    @Scheduled(cron = "0 * * * * *")
    public void printDate() {
        LocalDateTime now = LocalDateTime.now();
        String nowStartTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmm"));
        List<TestrunDTO> testrunList = testrunService.selectReserveTestrunList();
        testrunList.forEach((testrunDTO -> {
            if (TestrunCreationTypeCode.RESERVE.equals(testrunDTO.getCreationType())) {

                Long testrunId = testrunDTO.getId();
                LocalDateTime startDateTime = testrunDTO.getStartDateTime();

                if (now.isAfter(startDateTime)) {
                    clearTestrun(testrunDTO);
                    TestrunDTO result = testrunService.createTestrunInfo(testrunDTO.getProject().getSpace().getCode(), testrunDTO);
                    testrunService.updateTestrunReserveExpired(testrunId, true, result.getId());
                }


            } else if (TestrunCreationTypeCode.ITERATION.equals(testrunDTO.getCreationType())) {

                Long testrunId = testrunDTO.getId();
                LocalDateTime startDateTime = testrunDTO.getStartDateTime();
                LocalDateTime endDateTime = testrunDTO.getEndDateTime();
                String startTime = testrunDTO.getStartTime().format(DateTimeFormatter.ofPattern("HHmm"));

                if (startDateTime == null && endDateTime == null) {
                    return;
                }

                if (testrunDTO.getDays().charAt(now.getDayOfWeek().getValue() - 1) != '1') {
                    return;
                }

                if ((startDateTime == null || now.isAfter(startDateTime)) && (endDateTime == null || now.isBefore(endDateTime)) && nowStartTime.equals(startTime)) {
                    clearTestrun(testrunDTO);

                    testrunDTO.setStartDateTime(now);
                    testrunDTO.setEndDateTime(now.plusHours(testrunDTO.getDurationHours()));
                    testrunService.createTestrunInfo(testrunDTO.getProject().getSpace().getCode(), testrunDTO);
                }

                if (endDateTime != null && now.isAfter(endDateTime)) {
                    testrunService.updateTestrunReserveExpired(testrunId, true, null);
                }
            }
        }));

    }
}
