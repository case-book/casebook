package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
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
    private String testerType;
    private String testerValue;
    private LocalDateTime contentUpdateDate;

    public TestcaseDTO(Testcase testcase) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        if (testcase.getTestcaseGroup() != null) {
            this.testcaseGroup = TestcaseGroupDTO.builder().id(testcase.getTestcaseGroup().getId()).build();
        }
        this.name = testcase.getName();
        this.description = testcase.getDescription();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        if (testcase.getTestcaseTemplate() != null) {
            this.testcaseTemplate = new TestcaseTemplateDTO(testcase.getTestcaseTemplate());
        }
        if (testcase.getTestcaseItems() != null) {
            this.testcaseItems = testcase.getTestcaseItems().stream().map(TestcaseItemDTO::new).collect(Collectors.toList());
        }
        if (testcase.getProject() != null) {
            this.project = ProjectDTO.builder().id(testcase.getProject().getId()).build();
        }
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.contentUpdateDate = testcase.getContentUpdateDate();
        this.creationDate = testcase.getCreationDate();
    }


}
