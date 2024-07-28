package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseHistoryDTO;
import com.mindplates.bugcase.common.code.TestResultCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunTestcaseGroupTestcaseResultResponse {

    private Long id;
    private Long testrunId;
    private Long testrunTestcaseGroupId;
    private Long testcaseId;
    private String testrunSeqId;
    private TestResultCode testResult;

    public TestrunTestcaseGroupTestcaseResultResponse(TestrunTestcaseGroupTestcaseHistoryDTO testrunTestcaseGroupTestcase) {
        this.id = testrunTestcaseGroupTestcase.getId();
        this.testrunId = testrunTestcaseGroupTestcase.getTestrunId();
        this.testrunTestcaseGroupId = testrunTestcaseGroupTestcase.getTestrunTestcaseGroupId();
        this.testcaseId = testrunTestcaseGroupTestcase.getTestcaseId();
        this.testrunSeqId = testrunTestcaseGroupTestcase.getTestrunSeqId();
        this.testResult = testrunTestcaseGroupTestcase.getTestResult();
    }


}
