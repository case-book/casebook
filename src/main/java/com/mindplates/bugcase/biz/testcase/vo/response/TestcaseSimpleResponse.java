package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import lombok.Data;

@Data
public class TestcaseSimpleResponse {

    private Long id;
    private String seqId;
    private Long testcaseGroupId;
    private Long testcaseTemplateId;
    private String name;

    private String description;
    private Integer itemOrder;
    private Boolean closed;

    public TestcaseSimpleResponse(TestcaseDTO testcase) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        this.testcaseGroupId = testcase.getTestcaseGroup().getId();
        this.testcaseTemplateId = testcase.getTestcaseTemplate().getId();
        this.name = testcase.getName();
        this.description = testcase.getDescription();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
    }

}
