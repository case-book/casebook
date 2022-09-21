package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import lombok.Data;

import java.util.List;

@Data
public class TestcaseTemplateItemRequest {

    private Long id;
    private TestcaseItemType type;
    private Integer itemOrder;
    private String label;
    private List<String> options;
    private Integer size;

    private String crud;

    public TestcaseTemplateItem buildEntity() {

        return TestcaseTemplateItem.builder()
                .id(id)
                .type(type)
                .itemOrder(itemOrder)
                .label(label)
                .options(options)
                .size(size)
                .build();
    }


}
