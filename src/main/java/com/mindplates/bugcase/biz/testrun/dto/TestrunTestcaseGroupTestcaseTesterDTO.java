package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.common.code.TestResultCode;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseTesterDTO {

    private long id;
    private String testcaseName;
    private Long testerId;
    private TestResultCode testResult;

    public TestrunTestcaseGroupTestcaseTesterDTO(long id, String testcaseName, Long testerId, TestResultCode testResult) {
        this.id = id;
        this.testcaseName = testcaseName;
        this.testerId = testerId;
        this.testResult = testResult;
    }


}
