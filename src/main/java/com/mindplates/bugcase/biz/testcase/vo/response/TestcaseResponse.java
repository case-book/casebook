package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestcaseResponse {

    private Long id;
    private String seqId;
    private Long projectId;
    private Long testcaseGroupId;
    private Long testcaseTemplateId;
    private Long projectReleaseId;
    private String name;
    private Integer itemOrder;
    private Boolean closed;
    private List<TestcaseItemResponse> testcaseItems;
    private String description;
    private String testerType;
    private String testerValue;
    private String createdUserName;
    private String lastUpdatedUserName;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public TestcaseResponse(TestcaseDTO testcase) {
        this.id = testcase.getId();
        this.projectId = testcase.getProject().getId();
        this.seqId = testcase.getSeqId();
        this.testcaseGroupId = testcase.getTestcaseGroup().getId();
        this.testcaseTemplateId = testcase.getTestcaseTemplate().getId();
        if (testcase.getProjectRelease() != null) {
            this.projectReleaseId = testcase.getProjectRelease().getId();
        }
        this.name = testcase.getName();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        this.testcaseItems = testcase.getTestcaseItems().stream().map(TestcaseItemResponse::new).collect(Collectors.toList());
        this.description = testcase.getDescription();
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.createdUserName = testcase.getCreatedUserName();
        this.lastUpdatedUserName = testcase.getLastUpdatedUserName();
        this.creationDate = testcase.getCreationDate();
        this.lastUpdateDate = testcase.getLastUpdateDate();
    }

}
