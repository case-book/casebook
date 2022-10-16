package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import lombok.Data;

@Data
public class TestcaseItemResponse {

    private Long id;
    private Long testcaseId;
    private Long testcaseTemplateItemId;
    private String value;
    private String text;

    public TestcaseItemResponse(TestcaseItem testcaseItem) {
        this.id = testcaseItem.getId();
        this.testcaseId = testcaseItem.getTestcase().getId();
        this.testcaseTemplateItemId = testcaseItem.getTestcaseTemplateItem().getId();
        this.value = testcaseItem.getValue();
        this.text = testcaseItem.getText();
    }

}
