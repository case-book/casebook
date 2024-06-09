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
        this.testcaseTemplateItem = TestcaseTemplateItemDTO.builder()
            .id(testcaseItem.getTestcaseTemplateItem().getId())
            .category(testcaseItem.getTestcaseTemplateItem().getCategory())
            .type(testcaseItem.getTestcaseTemplateItem().getType())
            .itemOrder(testcaseItem.getTestcaseTemplateItem().getItemOrder())
            .label(testcaseItem.getTestcaseTemplateItem().getLabel())
            .options(testcaseItem.getTestcaseTemplateItem().getOptions())
            .size(testcaseItem.getTestcaseTemplateItem().getSize())
            .testcaseTemplate(TestcaseTemplateDTO.builder().id(testcaseItem.getTestcaseTemplateItem() != null && testcaseItem.getTestcaseTemplateItem().getTestcaseTemplate() != null ? testcaseItem.getTestcaseTemplateItem().getTestcaseTemplate().getId() : null).build())
            .defaultType(testcaseItem.getTestcaseTemplateItem().getDefaultType())
            .defaultValue(testcaseItem.getTestcaseTemplateItem().getDefaultValue())
            .description(testcaseItem.getTestcaseTemplateItem().getDescription())
            .example(testcaseItem.getTestcaseTemplateItem().getExample())
            .editable(testcaseItem.getTestcaseTemplateItem().getEditable())
            .systemLabel(testcaseItem.getTestcaseTemplateItem().getSystemLabel())
            .deleted(testcaseItem.getTestcaseTemplateItem().isDeleted())
            .build();
        this.testcase = TestcaseDTO.builder().id(testcaseItem.getTestcase().getId()).build();
        this.type = testcaseItem.getType();
        this.value = testcaseItem.getValue();
        this.text = testcaseItem.getText();
    }

}
