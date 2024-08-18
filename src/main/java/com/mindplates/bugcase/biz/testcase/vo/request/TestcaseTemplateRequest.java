package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestcaseTemplateRequest {

    private Long id;
    private String name;
    private String crud;
    private boolean defaultTemplate;
    private String defaultTesterType;
    private String defaultTesterValue;
    private List<TestcaseTemplateItemRequest> testcaseTemplateItems;

    public TestcaseTemplateDTO toDTO(ProjectDTO project) {

        TestcaseTemplateDTO testcaseTemplate = TestcaseTemplateDTO.builder()
            .id(id)
            .name(name)
            .defaultTemplate(defaultTemplate)
            .defaultTesterType(defaultTesterType)
            .defaultTesterValue(defaultTesterValue)
            .crud(crud)
            .project(project)
            .build();

        testcaseTemplate.setTestcaseTemplateItems(testcaseTemplateItems
            .stream()
            .map((testcaseTemplateItemRequest -> {
                TestcaseTemplateItemDTO testcaseTemplateItem = testcaseTemplateItemRequest.toDTO();
                testcaseTemplateItem.setTestcaseTemplate(testcaseTemplate);
                return testcaseTemplateItem;
            }))
            .collect(Collectors.toList()));

        return testcaseTemplate;


    }
}
