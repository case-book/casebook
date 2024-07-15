package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseTemplateItemResponse {

    private Long id;
    private TestcaseItemCategory category;
    private TestcaseItemType type;
    private Integer itemOrder;
    private String label;
    private List<String> options;
    private Integer size;
    private String defaultValue;
    private String defaultType;
    private String description;
    private String example;
    private Boolean editable;
    private String systemLabel;

    public TestcaseTemplateItemResponse(TestcaseTemplateItemDTO testcaseTemplateItem) {
        this.id = testcaseTemplateItem.getId();
        this.category = testcaseTemplateItem.getCategory();
        this.type = testcaseTemplateItem.getType();
        this.itemOrder = testcaseTemplateItem.getItemOrder();
        this.label = testcaseTemplateItem.getLabel();
        this.options = testcaseTemplateItem.getOptions();
        this.size = testcaseTemplateItem.getSize();
        this.defaultType = testcaseTemplateItem.getDefaultType();
        this.defaultValue = testcaseTemplateItem.getDefaultValue();
        this.description = testcaseTemplateItem.getDescription();
        this.example = testcaseTemplateItem.getExample();
        this.editable = testcaseTemplateItem.getEditable();
        this.systemLabel = testcaseTemplateItem.getSystemLabel();

    }
}
