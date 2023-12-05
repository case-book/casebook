package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.common.code.TestResultCode;
import java.time.LocalDateTime;
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
    private String createdUserName;
    private String lastUpdatedUserName;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public TestrunTestcaseGroupTestcaseResultResponse(TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase) {
        this.id = testrunTestcaseGroupTestcase.getId();
        this.testrunId = testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getTestrun().getId();
        this.testrunTestcaseGroupId = testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getId();
        this.testcaseId = testrunTestcaseGroupTestcase.getTestcase().getId();
        this.testrunSeqId = testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getTestrun().getSeqId();
        this.testResult = testrunTestcaseGroupTestcase.getTestResult();
        this.createdUserName = testrunTestcaseGroupTestcase.getTestcase().getCreatedUserName();
        this.lastUpdatedUserName = testrunTestcaseGroupTestcase.getTestcase().getLastUpdatedUserName();
        this.creationDate = testrunTestcaseGroupTestcase.getTestcase().getCreationDate();
        this.lastUpdateDate = testrunTestcaseGroupTestcase.getTestcase().getLastUpdateDate();
    }


}
