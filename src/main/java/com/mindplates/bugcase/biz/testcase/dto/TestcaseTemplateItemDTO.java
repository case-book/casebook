package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestcaseTemplateItemDTO extends CommonDTO implements IDTO<TestcaseTemplateItem> {

    private Long id;
    private TestcaseItemCategory category;
    private TestcaseItemType type;
    private Integer itemOrder;
    private String label;
    private List<String> options;
    private Integer size;
    private TestcaseTemplateDTO testcaseTemplate;
    private String defaultType;
    private String defaultValue;
    private String description;
    private String example;
    private Boolean editable;
    private String systemLabel;
    private boolean deleted;

    public TestcaseTemplateItemDTO(TestcaseTemplateItem testcaseTemplateItem) {
        this.id = testcaseTemplateItem.getId();
        this.category = testcaseTemplateItem.getCategory();
        this.type = testcaseTemplateItem.getType();
        this.itemOrder = testcaseTemplateItem.getItemOrder();
        this.label = testcaseTemplateItem.getLabel();
        this.options = testcaseTemplateItem.getOptions();
        this.size = testcaseTemplateItem.getSize();
        if (testcaseTemplateItem.getTestcaseTemplate() != null) {
            this.testcaseTemplate = TestcaseTemplateDTO.builder().id(testcaseTemplateItem.getTestcaseTemplate().getId()).build();
        }
        this.defaultType = testcaseTemplateItem.getDefaultType();
        this.defaultValue = testcaseTemplateItem.getDefaultValue();
        this.description = testcaseTemplateItem.getDescription();
        this.example = testcaseTemplateItem.getExample();
        this.editable = testcaseTemplateItem.getEditable();
        this.systemLabel = testcaseTemplateItem.getSystemLabel();
        this.deleted = testcaseTemplateItem.isDeleted();
    }


    @Override
    public TestcaseTemplateItem toEntity() {
        return TestcaseTemplateItem.builder()
            .id(this.id)
            .category(this.category)
            .type(this.type)
            .itemOrder(this.itemOrder)
            .label(this.label)
            .options(this.options)
            .size(this.size)
            .testcaseTemplate(TestcaseTemplate.builder().id(this.testcaseTemplate.getId()).build())
            .defaultType(this.defaultType)
            .defaultValue(this.defaultValue)
            .description(this.description)
            .example(this.example)
            .editable(this.editable)
            .systemLabel(this.systemLabel)
            .deleted(this.deleted)
            .build();

    }

    public TestcaseTemplateItem toEntity(TestcaseTemplate testcaseTemplate) {
        TestcaseTemplateItem testcaseTemplateItem = toEntity();
        testcaseTemplateItem.setTestcaseTemplate(testcaseTemplate);
        return testcaseTemplateItem;

    }

    public void updateInfo(TestcaseTemplateItemDTO updateTestcaseTemplateItem) {
        this.category = updateTestcaseTemplateItem.getCategory();
        this.type = updateTestcaseTemplateItem.getType();
        this.itemOrder = updateTestcaseTemplateItem.getItemOrder();
        this.label = updateTestcaseTemplateItem.getLabel();
        this.options = updateTestcaseTemplateItem.getOptions();
        this.size = updateTestcaseTemplateItem.getSize();
        this.defaultType = updateTestcaseTemplateItem.getDefaultType();
        this.defaultValue = updateTestcaseTemplateItem.getDefaultValue();
        this.description = updateTestcaseTemplateItem.getDescription();
        this.example = updateTestcaseTemplateItem.getExample();
        this.editable = updateTestcaseTemplateItem.getEditable();
        this.systemLabel = updateTestcaseTemplateItem.getSystemLabel();
        this.deleted = updateTestcaseTemplateItem.isDeleted();
    }
}
