package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import lombok.Data;

@Data
public class TestcaseResponse {

    private Long id;

    private Long testcaseGroupId;

    private Long testcaseTemplateId;
    private String name;
    private Integer itemOrder;

    private Boolean closed;

    public TestcaseResponse(Testcase testcase) {
        this.id = testcase.getId();
        this.testcaseGroupId = testcase.getTestcaseGroup().getId();
        this.testcaseTemplateId = testcase.getTestcaseTemplate().getId();
        this.name = testcase.getName();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
    }

}
