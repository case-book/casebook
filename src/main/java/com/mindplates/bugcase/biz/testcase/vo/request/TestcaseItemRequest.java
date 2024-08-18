package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class TestcaseItemRequest implements IRequestVO<TestcaseItemDTO> {

    private Long id;
    private Long testcaseTemplateItemId;
    private Long testcaseId;
    private String value;
    private String text;
    private String type;

    @Override
    public TestcaseItemDTO toDTO() {
        return TestcaseItemDTO.builder()
            .id(id)
            .testcaseTemplateItem(TestcaseTemplateItemDTO.builder().id(testcaseTemplateItemId).build())
            .testcase(TestcaseDTO.builder().id(testcaseId).build())
            .value(value)
            .text(text)
            .type(type)
            .build();
    }
}
