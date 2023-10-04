package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseDTO extends CommonDTO {

    private Long id;
    private String seqId;
    private TestcaseGroupDTO testcaseGroup;
    private String name;
    private String description;
    private Integer itemOrder;
    private Boolean closed;
    private TestcaseTemplateDTO testcaseTemplate;
    private List<TestcaseItemDTO> testcaseItems;
    private ProjectDTO project;
    private List<ProjectReleaseDTO> projectReleases;
    private String testerType;
    private String testerValue;
    private LocalDateTime contentUpdateDate;
    private String createdUserName;
    private String lastUpdatedUserName;

    public TestcaseDTO(Testcase testcase) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        this.testcaseGroup = TestcaseGroupDTO.builder().id(testcase.getTestcaseGroup().getId()).build();
        this.name = testcase.getName();
        this.description = testcase.getDescription();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        this.testcaseTemplate = new TestcaseTemplateDTO(testcase.getTestcaseTemplate());
        this.testcaseItems = testcase.getTestcaseItems().stream().map(TestcaseItemDTO::new).collect(Collectors.toList());
        this.project = ProjectDTO.builder().id(testcase.getProject().getId()).build();
        if (testcase.getTestcaseProjectReleases() != null) {
            this.projectReleases = testcase.getTestcaseProjectReleases()
                .stream()
                .map(testcaseProjectRelease -> new ProjectReleaseDTO(testcaseProjectRelease.getProjectRelease()))
                .distinct()
                .collect(Collectors.toList());
        }
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.contentUpdateDate = testcase.getContentUpdateDate();
        this.creationDate = testcase.getCreationDate();
        this.lastUpdateDate = testcase.getLastUpdateDate();
        this.createdBy = testcase.getCreatedBy();
        this.lastUpdatedBy = testcase.getLastUpdatedBy();
    }

    public TestcaseDTO(Testcase testcase, User createdUser, User lastUpdatedUser) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        this.testcaseGroup = TestcaseGroupDTO.builder().id(testcase.getTestcaseGroup().getId()).build();
        this.name = testcase.getName();
        this.description = testcase.getDescription();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        this.testcaseTemplate = new TestcaseTemplateDTO(testcase.getTestcaseTemplate());
        this.testcaseItems = testcase.getTestcaseItems().stream().map(TestcaseItemDTO::new).collect(Collectors.toList());
        this.project = ProjectDTO.builder().id(testcase.getProject().getId()).build();
        if (testcase.getTestcaseProjectReleases() != null) {
            this.projectReleases = testcase.getTestcaseProjectReleases()
                .stream()
                .map(testcaseProjectRelease -> new ProjectReleaseDTO(testcaseProjectRelease.getProjectRelease()))
                .distinct()
                .collect(Collectors.toList());
        }
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.contentUpdateDate = testcase.getContentUpdateDate();
        this.creationDate = testcase.getCreationDate();
        this.lastUpdateDate = testcase.getLastUpdateDate();
        if (createdUser != null) {
            this.createdUserName = createdUser.getName();
        }

        if (lastUpdatedUser != null) {
            this.lastUpdatedUserName = lastUpdatedUser.getName();
        }
    }


}
