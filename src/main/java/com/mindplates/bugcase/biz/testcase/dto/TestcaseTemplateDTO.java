package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.Collections;
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
public class TestcaseTemplateDTO extends CommonDTO implements IDTO<TestcaseTemplate> {

    private Long id;
    private String name;
    private boolean defaultTemplate;
    private String defaultTesterType;
    private String defaultTesterValue;
    private ProjectDTO project;
    private List<TestcaseTemplateItemDTO> testcaseTemplateItems;
    private String crud;

    public TestcaseTemplateDTO(TestcaseTemplate testcaseTemplate) {
        this.id = testcaseTemplate.getId();
        this.name = testcaseTemplate.getName();
        this.defaultTemplate = testcaseTemplate.isDefaultTemplate();
        this.defaultTesterType = testcaseTemplate.getDefaultTesterType();
        this.defaultTesterValue = testcaseTemplate.getDefaultTesterValue();
        if (testcaseTemplate.getProject() != null) {
            this.project = ProjectDTO.builder().id(testcaseTemplate.getProject().getId()).build();
        }
        if (testcaseTemplate.getTestcaseTemplateItems() != null) {
            this.testcaseTemplateItems = testcaseTemplate.getTestcaseTemplateItems().stream().map(TestcaseTemplateItemDTO::new).collect(Collectors.toList());
        }
        this.crud = testcaseTemplate.getCrud();

    }


    @Override
    public TestcaseTemplate toEntity() {
        TestcaseTemplate testcaseTemplate = TestcaseTemplate.builder()
            .id(this.id)
            .name(this.name)
            .defaultTemplate(this.defaultTemplate)
            .defaultTesterType(this.defaultTesterType)
            .defaultTesterValue(this.defaultTesterValue)
            .project(Project.builder().id(this.project.getId()).build())
            .crud(this.crud)
            .build();

        if (this.testcaseTemplateItems != null) {
            testcaseTemplate.setTestcaseTemplateItems(
                this.testcaseTemplateItems.stream().map(testcaseTemplateItemDTO -> testcaseTemplateItemDTO.toEntity(testcaseTemplate)).collect(Collectors.toList()));
        } else {
            testcaseTemplate.setTestcaseTemplateItems(Collections.emptyList());
        }

        return testcaseTemplate;
    }

    public TestcaseTemplate toEntity(Project project) {
        TestcaseTemplate testcaseTemplate = toEntity();
        testcaseTemplate.setProject(project);
        return testcaseTemplate;
    }
}
