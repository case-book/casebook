package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import lombok.Data;

@Data
public class TestcaseItemResponse {

    private Long id;
    private Long testcaseId;
    private Long testcaseTemplateItemId;
    private String value;
    private String text;

    private String type;

    public TestcaseItemResponse(TestcaseItemDTO testcaseItem) {
        this.id = testcaseItem.getId();
        this.testcaseId = testcaseItem.getTestcase().getId();
        this.testcaseTemplateItemId = testcaseItem.getTestcaseTemplateItem().getId();
        this.value = testcaseItem.getValue();
        this.text = testcaseItem.getText();
        this.type = testcaseItem.getType();
    }

}
