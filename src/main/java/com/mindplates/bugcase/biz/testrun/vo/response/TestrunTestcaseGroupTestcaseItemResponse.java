package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunTestcaseGroupTestcaseItemResponse {

    private Long id;
    private Long testcaseTemplateItemId;
    private Long testrunTestcaseGroupTestcaseId;
    private String type;
    private String value;
    private String text;

    public TestrunTestcaseGroupTestcaseItemResponse(TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItem) {
        this.id = testrunTestcaseGroupTestcaseItem.getId();
        this.testcaseTemplateItemId = testrunTestcaseGroupTestcaseItem.getTestcaseTemplateItem().getId();
        this.testrunTestcaseGroupTestcaseId = testrunTestcaseGroupTestcaseItem.getTestrunTestcaseGroupTestcase().getId();
        this.type = testrunTestcaseGroupTestcaseItem.getType();
        this.value = testrunTestcaseGroupTestcaseItem.getValue();
        this.text = testrunTestcaseGroupTestcaseItem.getText();
    }


}
