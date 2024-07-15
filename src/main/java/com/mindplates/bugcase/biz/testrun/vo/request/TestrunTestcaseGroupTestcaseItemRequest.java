package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import lombok.Data;

@Data
public class TestrunTestcaseGroupTestcaseItemRequest {

    private Long id;
    private Long testcaseTemplateItemId;
    private Long testrunTestcaseGroupTestcaseId;
    private String type;
    private String value;
    private String text;


    public TestrunTestcaseGroupTestcaseItemDTO toDTO() {

        return TestrunTestcaseGroupTestcaseItemDTO.builder()
            .id(id)
            .testcaseTemplateItem(TestcaseTemplateItemDTO.builder().id(testcaseTemplateItemId).build())
            .testrunTestcaseGroupTestcase(TestrunTestcaseGroupTestcaseDTO.builder().id(testrunTestcaseGroupTestcaseId).build())
            .type(type)
            .value(value)
            .text(text)
            .build();
    }


}
