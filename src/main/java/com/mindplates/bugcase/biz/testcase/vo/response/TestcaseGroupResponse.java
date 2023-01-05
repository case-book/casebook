package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class TestcaseGroupResponse {

    private Long id;

    private String seqId;

    private Long parentId;

    private Long depth;

    private String name;

    private String description;
    private Integer itemOrder;

    private List<TestcaseSimpleResponse> testcases;

    public TestcaseGroupResponse(TestcaseGroupDTO testcaseGroup) {
        this.id = testcaseGroup.getId();
        this.seqId = testcaseGroup.getSeqId();
        this.parentId = testcaseGroup.getParentId();
        this.depth = testcaseGroup.getDepth();
        this.name = testcaseGroup.getName();
        this.description = testcaseGroup.getDescription();
        this.itemOrder = testcaseGroup.getItemOrder();
        if (testcaseGroup.getTestcases() != null) {
            this.testcases = testcaseGroup.getTestcases().stream().map(TestcaseSimpleResponse::new).collect(Collectors.toList());
        }

    }

}
