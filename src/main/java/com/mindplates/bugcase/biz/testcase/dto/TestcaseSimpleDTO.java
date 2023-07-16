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

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseSimpleDTO extends CommonDTO {

    private Long id;
    private String seqId;
    private TestcaseGroupDTO testcaseGroup;
    private String name;
    private String description;
    private Integer itemOrder;
    private Boolean closed;
    private TestcaseTemplateDTO testcaseTemplate;
    private ProjectDTO project;
    private String testerType;
    private String testerValue;
    private LocalDateTime contentUpdateDate;

    public TestcaseSimpleDTO(Testcase testcase) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        this.testcaseGroup = TestcaseGroupDTO.builder().id(testcase.getTestcaseGroup().getId()).build();
        this.name = testcase.getName();
        this.description = testcase.getDescription();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        this.testcaseTemplate = TestcaseTemplateDTO.builder().id(testcase.getTestcaseTemplate().getId()).build();
        this.project = ProjectDTO.builder().id(testcase.getProject().getId()).build();
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.contentUpdateDate = testcase.getContentUpdateDate();
    }


}
