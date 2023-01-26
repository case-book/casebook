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
import java.util.Date;
import java.util.List;

@Component
@Slf4j
@AllArgsConstructor
public class TestrunScheduler {

    private final TestrunService testrunService;

    @Scheduled(cron = "0 * * * * *")
    public void printDate() {


        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
        List<TestrunDTO> testrunList = testrunService.selectReserveTestrunList();
        testrunList.forEach((testrunDTO -> {
            if (TestrunCreationTypeCode.RESERVE.equals(testrunDTO.getCreationType())) {

                Long testrunId = testrunDTO.getId();
                String startDateTime = testrunDTO.getStartDateTime().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));

                if (now.equals(startDateTime)) {
                    // condition
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


                    testrunService.createTestrunInfo(testrunDTO.getProject().getSpace().getCode(), testrunDTO);

                    testrunService.updateTestrunReserveExpired(testrunId, true);
                }


            }
        }));
        log.error(new Date().toString());
        System.out.println(testrunList.size());
    }
}
