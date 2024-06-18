package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import lombok.Data;

@Data
public class TestcaseItemRequest {

    private Long id;
    private Long testcaseTemplateItemId;
    private Long testcaseId;
    private String value;
    private String text;
    private String type;

    public TestcaseItem buildEntity() {
        return TestcaseItem.builder()
                .id(id)
                .testcaseTemplateItem(TestcaseTemplateItem.builder().id(testcaseTemplateItemId).build())
                .testcase(Testcase.builder().id(testcaseId).build())
                .value(value)
                .text(text)
                .type(type)
                .build();
    }
}
