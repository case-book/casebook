package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import lombok.Data;

@Data
public class TestcaseUpdateRequest {

    private Long id;
    private Long testcaseGroupId;
    private Long testcaseTemplateId;
    private String name;
    private Integer itemOrder;
    private Boolean closed;

    public Testcase buildEntity() {
        return Testcase.builder()
                .id(id)
                .testcaseGroup(TestcaseGroup.builder().id(testcaseGroupId).build())
                .testcaseTemplate(TestcaseTemplate.builder().id(testcaseTemplateId).build())
                .name(name)
                .itemOrder(itemOrder)
                .closed(closed)
                .build();
    }
}
