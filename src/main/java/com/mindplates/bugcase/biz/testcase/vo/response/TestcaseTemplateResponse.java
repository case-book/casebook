package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseTemplateResponse {

    private Long id;
    private String name;
    private boolean defaultTemplate;
    private String defaultTesterType;
    private String defaultTesterValue;
    private List<TestcaseTemplateItemResponse> testcaseTemplateItems;

    public TestcaseTemplateResponse(TestcaseTemplateDTO testcaseTemplate) {
        this.id = testcaseTemplate.getId();
        this.name = testcaseTemplate.getName();
        this.defaultTemplate = testcaseTemplate.isDefaultTemplate();
        this.testcaseTemplateItems = testcaseTemplate.getTestcaseTemplateItems().stream().map(TestcaseTemplateItemResponse::new).collect(Collectors.toList());
        this.defaultTesterValue = testcaseTemplate.getDefaultTesterValue();
        this.defaultTesterType = testcaseTemplate.getDefaultTesterType();
    }
}
