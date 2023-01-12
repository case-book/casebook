package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseTemplateItemDTO extends CommonEntity {

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


}
