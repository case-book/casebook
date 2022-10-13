package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class TestcaseGroupResponse {

    private Long id;

    private Long parentId;

    private Long depth;

    private String name;
    private Integer itemOrder;

    private List<TestcaseSimpleResponse> testcases;

    public TestcaseGroupResponse(TestcaseGroup testcaseGroup) {
        this.id = testcaseGroup.getId();
        this.parentId = testcaseGroup.getParentId();
        this.depth = testcaseGroup.getDepth();
        this.name = testcaseGroup.getName();
        this.itemOrder = testcaseGroup.getItemOrder();
        if (testcaseGroup.getTestcases() != null) {
            this.testcases = testcaseGroup.getTestcases().stream().map(TestcaseSimpleResponse::new).collect(Collectors.toList());
        }

    }

}