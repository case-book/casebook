package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import lombok.Data;

@Data
public class TestcaseCreateRequest {

    private Long id;
    private Long testcaseGroupId;
    private String name;
    private Integer itemOrder;

    public Testcase buildEntity() {
        return Testcase.builder()
                .id(id)
                .testcaseGroup(TestcaseGroup.builder().id(testcaseGroupId).build())
                .name(name)
                .itemOrder(itemOrder)
                .build();
    }
}
