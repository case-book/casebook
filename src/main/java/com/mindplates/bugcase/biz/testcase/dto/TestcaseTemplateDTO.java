package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseTemplateDTO extends CommonDTO {

    private Long id;
    private String name;
    private boolean defaultTemplate;
    private String defaultTesterType;
    private String defaultTesterValue;
    private ProjectDTO project;
    private List<TestcaseTemplateItemDTO> testcaseTemplateItems;
    private String crud;

    public TestcaseTemplateDTO (TestcaseTemplate testcaseTemplate) {
        this.id = testcaseTemplate.getId();
        this.name = testcaseTemplate.getName();
        this.defaultTemplate = testcaseTemplate.isDefaultTemplate();
        this.defaultTesterType = testcaseTemplate.getDefaultTesterType();
        this.defaultTesterValue = testcaseTemplate.getDefaultTesterValue();
        this.project = ProjectDTO.builder().id(testcaseTemplate.getProject().getId()).build();
        this.testcaseTemplateItems = testcaseTemplate.getTestcaseTemplateItems().stream().map(TestcaseTemplateItemDTO::new).collect(Collectors.toList());
        this.crud = testcaseTemplate.getCrud();

    }


}
