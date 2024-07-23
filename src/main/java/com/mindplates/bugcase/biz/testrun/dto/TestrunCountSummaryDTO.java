package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.common.code.TestResultCode;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunCountSummaryDTO {
    private Long id;
    private String seqId;
    private String name;
    private long projectId;
    private int totalTestcaseCount;
    private int passedTestcaseCount;
    private int failedTestcaseCount;
    private int untestableTestcaseCount;
    private boolean done;

    public TestrunCountSummaryDTO(long id, String seqId, String name, long projectId, int totalTestcaseCount, int passedTestcaseCount, int failedTestcaseCount, int untestableTestcaseCount) {
        this.id = id;
        this.seqId = seqId;
        this.name = name;
        this.projectId = projectId;
        this.totalTestcaseCount = totalTestcaseCount;
        this.passedTestcaseCount = passedTestcaseCount;
        this.failedTestcaseCount = failedTestcaseCount;
        this.untestableTestcaseCount = untestableTestcaseCount;
    }

    public boolean isAllTestcaseDone() {
        return this.totalTestcaseCount <= this.passedTestcaseCount + this.failedTestcaseCount + this.untestableTestcaseCount;
    }

    public void updateCount (TestrunTestcaseGroupTestcase targetTestrunTestcaseGroupTestcase, TestResultCode testResultCode) {
        if (!Objects.isNull(targetTestrunTestcaseGroupTestcase.getTestResult())) {
            if (targetTestrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.PASSED)) {
                this.passedTestcaseCount--;
            } else if (targetTestrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.FAILED)) {
                this.failedTestcaseCount--;
            } else if (targetTestrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.UNTESTABLE)) {
                this.untestableTestcaseCount--;
            }
        }

        if (testResultCode.equals(TestResultCode.PASSED)) {
            this.passedTestcaseCount++;
        } else if (testResultCode.equals(TestResultCode.FAILED)) {
            this.failedTestcaseCount++;
        } else if (testResultCode.equals(TestResultCode.UNTESTABLE)) {
            this.untestableTestcaseCount++;
        }

        this.done = isAllTestcaseDone();
    }
}
