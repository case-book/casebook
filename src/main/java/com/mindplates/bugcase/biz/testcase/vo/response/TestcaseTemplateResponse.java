package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseTemplateResponse {

    private Long id;
    private String name;
    private Boolean isDefault;
    private String defaultTesterType;
    private String defaultTesterValue;
    private List<TestcaseTemplateItemResponse> testcaseTemplateItems;

    public TestcaseTemplateResponse(TestcaseTemplate testcaseTemplate) {
        this.id = testcaseTemplate.getId();
        this.name = testcaseTemplate.getName();
        this.isDefault = testcaseTemplate.getIsDefault();
        this.testcaseTemplateItems = testcaseTemplate.getTestcaseTemplateItems().stream().map(TestcaseTemplateItemResponse::new).collect(Collectors.toList());
        this.defaultTesterValue = testcaseTemplate.getDefaultTesterValue();
        this.defaultTesterType = testcaseTemplate.getDefaultTesterType();
    }
}
