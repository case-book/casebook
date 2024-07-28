package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunStatusDTO extends CommonDTO {

    private Long id;
    private boolean done;
    private int totalTestcaseCount;
    private int passedTestcaseCount;
    private int failedTestcaseCount;
    private int untestableTestcaseCount;


    public TestrunStatusDTO(TestrunCountSummaryDTO testrunCountSummary) {
        this.id = testrunCountSummary.getId();
        this.done = testrunCountSummary.isDone();
        this.totalTestcaseCount = testrunCountSummary.getTotalTestcaseCount();
        this.passedTestcaseCount = testrunCountSummary.getPassedTestcaseCount();
        this.failedTestcaseCount = testrunCountSummary.getFailedTestcaseCount();
        this.untestableTestcaseCount = testrunCountSummary.getUntestableTestcaseCount();
    }

}
