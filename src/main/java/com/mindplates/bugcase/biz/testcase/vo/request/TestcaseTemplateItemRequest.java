package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import lombok.Data;

import java.util.List;

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

    private String crud;

    public TestcaseTemplateItem buildEntity() {

        return TestcaseTemplateItem.builder()
                .id(id)
                .category(category)
                .type(type)
                .itemOrder(itemOrder)
                .label(label)
                .options(options)
                .size(size)
                .defaultValue(defaultValue)
                .defaultType(defaultType)
                .build();
    }


}
