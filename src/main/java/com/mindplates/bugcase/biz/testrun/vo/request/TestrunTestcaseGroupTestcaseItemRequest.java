package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import lombok.Data;

@Data
public class TestrunTestcaseGroupTestcaseItemRequest {

    private Long id;
    private Long testcaseTemplateItemId;
    private Long testrunTestcaseGroupTestcaseId;
    private String type;
    private String value;
    private String text;


    public TestrunTestcaseGroupTestcaseItem buildEntity() {

        return TestrunTestcaseGroupTestcaseItem.builder()
                .id(id)
                .testcaseTemplateItem(TestcaseTemplateItem.builder().id(testcaseTemplateItemId).build())
                .testrunTestcaseGroupTestcase(TestrunTestcaseGroupTestcase.builder().id(testrunTestcaseGroupTestcaseId).build())
                .type(type)
                .value(value)
                .text(text)
                .build();
    }


}
