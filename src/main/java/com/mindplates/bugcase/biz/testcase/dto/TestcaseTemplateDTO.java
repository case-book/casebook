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

    public void updateInfo(TestcaseTemplateDTO updateTestcaseTemplate) {
        this.name = updateTestcaseTemplate.getName();
        this.defaultTemplate = updateTestcaseTemplate.isDefaultTemplate();
        this.defaultTesterType = updateTestcaseTemplate.getDefaultTesterType();
        this.defaultTesterValue = updateTestcaseTemplate.getDefaultTesterValue();
        this.crud = updateTestcaseTemplate.getCrud();

        // updateTestcaseTemplateItems의 ID가 없는 경우, testcaseTemplateItems에 추가
        updateTestcaseTemplate.getTestcaseTemplateItems().stream()
            .filter(updateTestcaseTemplateItem -> updateTestcaseTemplateItem.getId() == null)
            .forEach(updateTestcaseTemplateItem -> this.testcaseTemplateItems.add(updateTestcaseTemplateItem));

        // updateTestcaseTemplateItems의 crud가 D인 템플릿을 testcaseTemplateItems에서 제거
        this.testcaseTemplateItems.removeIf(testcaseTemplateItem -> updateTestcaseTemplate.getTestcaseTemplateItems().stream()
            .anyMatch(updateTestcaseTemplateItem -> updateTestcaseTemplateItem.isDeleted() && updateTestcaseTemplateItem.getId().equals(testcaseTemplateItem.getId())));

        // ID가 있고, crud가 D가 아닌 경우, testcaseTemplateItems을 업데이트
        updateTestcaseTemplate.getTestcaseTemplateItems().stream()
            .filter(updateTestcaseTemplateItem -> updateTestcaseTemplateItem.getId() != null && !updateTestcaseTemplateItem.isDeleted())
            .forEach(updateTestcaseTemplateItem -> {
                for (TestcaseTemplateItemDTO testcaseTemplateItem : this.testcaseTemplateItems) {
                    if (testcaseTemplateItem.getId() != null && testcaseTemplateItem.getId().equals(updateTestcaseTemplateItem.getId())) {
                        testcaseTemplateItem.updateInfo(updateTestcaseTemplateItem);
                    }
                }
            });


    }
}
