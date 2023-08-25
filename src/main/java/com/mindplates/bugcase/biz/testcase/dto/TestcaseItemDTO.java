package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseItemDTO extends CommonDTO {

    private Long id;
    private TestcaseTemplateItemDTO testcaseTemplateItem;
    private TestcaseDTO testcase;
    private String type;
    private String value;
    private String text;

    public TestcaseItemDTO(TestcaseItem testcaseItem) {
        this.id = testcaseItem.getId();
        if (testcaseItem.getTestcaseTemplateItem() != null) {
            this.testcaseTemplateItem = TestcaseTemplateItemDTO.builder().id(testcaseItem.getTestcaseTemplateItem().getId()).build();
        }
        this.testcase = TestcaseDTO.builder().id(testcaseItem.getTestcase().getId()).build();
        this.type = testcaseItem.getType();
        this.value = testcaseItem.getValue();
        this.text = testcaseItem.getText();
    }

}
