package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseItemResponse;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.common.code.TestResultCode;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunTestcaseGroupTestcaseResponse {

    private Long id;
    private Long testcaseId;
    private Long testrunTestcaseGroupId;
    private Long testrunTestcaseGroupTestcaseId;
    private Long testcaseTemplateId;
    private String seqId;
    private String name;
    private String description;
    private Integer itemOrder;
    private Boolean closed;
    private List<TestcaseItemResponse> testcaseItems;
    private List<TestrunTestcaseGroupTestcaseItemResponse> testrunTestcaseItems;
    private List<TestrunTestcaseGroupTestcaseCommentResponse> comments;
    private TestResultCode testResult;
    private Long testerId;
    private String createdUserName;
    private String lastUpdatedUserName;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public TestrunTestcaseGroupTestcaseResponse(TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase) {
        this.id = testrunTestcaseGroupTestcase.getId();
        this.testrunTestcaseGroupId = testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getId();
        this.testrunTestcaseGroupTestcaseId = testrunTestcaseGroupTestcase.getId();
        this.testcaseId = testrunTestcaseGroupTestcase.getTestcase().getId();
        this.testcaseTemplateId = testrunTestcaseGroupTestcase.getTestcase().getTestcaseTemplate().getId();
        this.seqId = testrunTestcaseGroupTestcase.getTestcase().getSeqId();
        this.name = testrunTestcaseGroupTestcase.getTestcase().getName();
        this.description = testrunTestcaseGroupTestcase.getTestcase().getDescription();
        this.itemOrder = testrunTestcaseGroupTestcase.getTestcase().getItemOrder();
        this.closed = testrunTestcaseGroupTestcase.getTestcase().getClosed();
        this.testResult = testrunTestcaseGroupTestcase.getTestResult();
        this.createdUserName = testrunTestcaseGroupTestcase.getTestcase().getCreatedUserName();
        this.lastUpdatedUserName = testrunTestcaseGroupTestcase.getTestcase().getLastUpdatedUserName();
        this.creationDate = testrunTestcaseGroupTestcase.getTestcase().getCreationDate();
        this.lastUpdateDate = testrunTestcaseGroupTestcase.getTestcase().getLastUpdateDate();

        if (testrunTestcaseGroupTestcase.getTester() != null) {
            this.testerId = testrunTestcaseGroupTestcase.getTester().getId();
        }


        if (testrunTestcaseGroupTestcase.getTestcase().getTestcaseItems() != null && !testrunTestcaseGroupTestcase.getTestcase().getTestcaseItems().isEmpty()) {
            this.testcaseItems = testrunTestcaseGroupTestcase.getTestcase().getTestcaseItems().stream().map(TestcaseItemResponse::new).collect(Collectors.toList());
        }

        if (testrunTestcaseGroupTestcase.getTestcaseItems() != null && !testrunTestcaseGroupTestcase.getTestcaseItems().isEmpty()) {
            this.testrunTestcaseItems = testrunTestcaseGroupTestcase.getTestcaseItems().stream().map(TestrunTestcaseGroupTestcaseItemResponse::new).collect(Collectors.toList());
        }

        if (testrunTestcaseGroupTestcase.getComments() != null && !testrunTestcaseGroupTestcase.getComments().isEmpty()) {
            this.comments = testrunTestcaseGroupTestcase.getComments().stream().map(TestrunTestcaseGroupTestcaseCommentResponse::new).collect(Collectors.toList());
        }

    }


}
