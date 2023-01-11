package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseItemDTO extends CommonDTO {

    private Long id;
    private TestcaseTemplateItemDTO testcaseTemplateItem;
    private TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase;
    private String type;
    private String value;
    private String text;

    public TestrunTestcaseGroupTestcaseItemDTO(TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem) {
        this.id = testrunTestcaseGroupTestcaseItem.getId();
        this.testcaseTemplateItem = new TestcaseTemplateItemDTO(testrunTestcaseGroupTestcaseItem.getTestcaseTemplateItem());
        this.testrunTestcaseGroupTestcase = TestrunTestcaseGroupTestcaseDTO.builder().id(testrunTestcaseGroupTestcaseItem.getTestrunTestcaseGroupTestcase().getId()).build();
        this.type = testrunTestcaseGroupTestcaseItem.getType();
        this.value = testrunTestcaseGroupTestcaseItem.getValue();
        this.text = testrunTestcaseGroupTestcaseItem.getText();
    }

}
