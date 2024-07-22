package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.common.code.TestResultCode;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseHistoryDTO {

    private Long id;
    private Long testrunId;
    private Long testrunTestcaseGroupId;
    private Long testcaseId;
    private String testrunSeqId;
    private TestResultCode testResult;


    public TestrunTestcaseGroupTestcaseHistoryDTO(long id, long testrunId, long testrunTestcaseGroupId, long testcaseId, TestResultCode testResult) {
        this.id = id;
        this.testrunId = testrunId;
        this.testrunTestcaseGroupId = testrunTestcaseGroupId;
        this.testcaseId = testcaseId;
        this.testResult = testResult;
    }


}
