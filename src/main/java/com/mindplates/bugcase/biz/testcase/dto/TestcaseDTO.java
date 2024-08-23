package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestcaseDTO extends CommonDTO implements IDTO<Testcase> {

    private Long id;
    private String seqId;
    private String name;
    private String description;
    private Integer itemOrder;
    private Boolean closed;
    private String testerType;
    private String testerValue;
    private LocalDateTime contentUpdateDate;
    private String createdUserName;
    private String lastUpdatedUserName;
    private ProjectDTO project;
    private TestcaseGroupDTO testcaseGroup;
    private TestcaseTemplateDTO testcaseTemplate;
    private List<TestcaseItemDTO> testcaseItems;
    private List<ProjectReleaseDTO> projectReleases;


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
                .map(testcaseProjectRelease -> ProjectReleaseDTO.builder().id(testcaseProjectRelease.getProjectRelease().getId()).build())
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

    @Override
    public Testcase toEntity() {
        Testcase testcase = Testcase.builder()
            .id(this.id)
            .seqId(this.seqId)
            .name(this.name)
            .description(this.description)
            .itemOrder(this.itemOrder)
            .closed(this.closed)
            .testerType(this.testerType)
            .testerValue(this.testerValue)
            .contentUpdateDate(this.contentUpdateDate)
            .build();

        if (this.project != null) {
            testcase.setProject(Project.builder().id(this.project.getId()).build());
        }

        if (this.testcaseGroup != null) {
            testcase.setTestcaseGroup(TestcaseGroup.builder().id(this.testcaseGroup.getId()).build());
        }

        if (this.testcaseTemplate != null) {
            testcase.setTestcaseTemplate(TestcaseTemplate.builder().id(this.testcaseTemplate.getId()).build());
        }

        if (this.testcaseItems != null) {
            testcase.setTestcaseItems(this.testcaseItems.stream().map(testcaseItemDTO -> testcaseItemDTO.toEntity(testcase)).collect(Collectors.toList()));
        }

        if (this.projectReleases != null) {
            testcase.setTestcaseProjectReleases(
                this.projectReleases.stream().map(projectReleaseDTO ->
                        TestcaseProjectRelease.builder()
                            .projectRelease(ProjectRelease.builder().id(projectReleaseDTO.getId()).build())
                            .testcase(testcase).build())
                    .collect(Collectors.toList()));

        }

        return testcase;
    }

    public Testcase toEntity(TestcaseGroup testcaseGroup) {
        Testcase testcase = toEntity();
        testcase.setTestcaseGroup(testcaseGroup);
        return testcase;
    }
}
