package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class TestcaseTemplateRequest {

    private Long id;
    private String name;

    private String crud;

    private Boolean isDefault;

    private String defaultTesterType;

    private String defaultTesterValue;

    private List<TestcaseTemplateItemRequest> testcaseTemplateItems;

    public TestcaseTemplate buildEntity() {

        TestcaseTemplate testcaseTemplate = TestcaseTemplate.builder()
                .id(id)
                .name(name)
                .isDefault(isDefault)
                .defaultTesterType(defaultTesterType)
                .defaultTesterValue(defaultTesterValue)
                .deleted("D".equals(crud))
                .build();

        testcaseTemplate.setTestcaseTemplateItems(testcaseTemplateItems
                .stream()
                .map((testcaseTemplateItemRequest -> {
                    TestcaseTemplateItem testcaseTemplateItem = testcaseTemplateItemRequest.buildEntity();
                    testcaseTemplateItem.setTestcaseTemplate(testcaseTemplate);
                    return testcaseTemplateItem;
                }))
                .collect(Collectors.toList()));

        return testcaseTemplate;


    }


}
