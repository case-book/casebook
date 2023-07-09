package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
        this.testcaseGroup = TestcaseGroupDTO.builder().id(testcase.getTestcaseGroup().getId()).seqId(testcase.getTestcaseGroup().getSeqId()).name(testcase.getTestcaseGroup().getName()).build();
        this.name = testcase.getName();
        this.description = testcase.getDescription();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        this.testcaseTemplate = new TestcaseTemplateDTO(testcase.getTestcaseTemplate());
        this.testcaseItems = testcase.getTestcaseItems().stream().map(TestcaseItemDTO::new).collect(Collectors.toList());
        this.project = ProjectDTO.builder().id(testcase.getProject().getId()).build();
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.contentUpdateDate = testcase.getContentUpdateDate();
        this.creationDate = testcase.getCreationDate();
    }


}
