package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import java.util.List;
import lombok.Data;

@Data
public class TestcaseTemplateItemRequest {

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

    private String crud;

    private Boolean editable;

    private String systemLabel;

    public TestcaseTemplateItemDTO toDTO() {

        return TestcaseTemplateItemDTO.builder()
            .id(id)
            .category(category)
            .type(type)
            .itemOrder(itemOrder)
            .label(label)
            .options(options)
            .size(size)
            .defaultValue(defaultValue)
            .defaultType(defaultType)
            .description(description)
            .example(example)
            .editable(editable)
            .systemLabel(systemLabel)
            .deleted("D".equals(crud))
            .build();
    }


}
