package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import lombok.Data;

@Data
public class TestcaseGroupResponse {

    private Long id;

    private Long parentId;

    private Long depth;

    private String name;
    private Integer itemOrder;

    public TestcaseGroupResponse(TestcaseGroup testcaseGroup) {
        this.id = testcaseGroup.getId();
        this.parentId = testcaseGroup.getParentId();
        this.depth = testcaseGroup.getDepth();
        this.name = testcaseGroup.getName();
        this.itemOrder = testcaseGroup.getItemOrder();
    }

}
