package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseResponse {

    private Long id;
    private String seqId;
    private Long projectId;
    private Long testcaseGroupId;
    private Long testcaseTemplateId;
    private List<Long> projectReleaseIds;
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

    public TestcaseResponse(TestcaseDTO testcase, UserDTO createdUser, UserDTO lastUpdatedUser) {
        this.id = testcase.getId();
        this.projectId = testcase.getProject().getId();
        this.seqId = testcase.getSeqId();
        this.testcaseGroupId = testcase.getTestcaseGroup().getId();
        this.testcaseTemplateId = testcase.getTestcaseTemplate().getId();
        if (testcase.getProjectReleases() != null) {
            this.projectReleaseIds = testcase.getProjectReleases()
                .stream()
                .map(ProjectReleaseDTO::getId)
                .distinct()
                .collect(Collectors.toList());
        }
        this.name = testcase.getName();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        this.testcaseItems = testcase.getTestcaseItems().stream().map(TestcaseItemResponse::new).collect(Collectors.toList());
        this.description = testcase.getDescription();
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.createdUserName = createdUser != null ? createdUser.getName() : "";
        this.lastUpdatedUserName = lastUpdatedUser != null ? lastUpdatedUser.getName() : "";
        this.creationDate = testcase.getCreationDate();
        this.lastUpdateDate = testcase.getLastUpdateDate();
    }

}
