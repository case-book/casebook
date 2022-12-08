package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunTestcaseGroupResponse {

    private Long id;
    private Long testcaseGroupId;
    private String seqId;
    private Long parentId;
    private Long depth;
    private String name;
    private String description;
    private Integer itemOrder;
    private List<TestrunTestcaseGroupTestcaseResponse> testcases;

    public TestrunTestcaseGroupResponse(TestrunTestcaseGroup testrunTestcaseGroup) {
        this.id = testrunTestcaseGroup.getId();
        this.testcaseGroupId = testrunTestcaseGroup.getTestcaseGroup().getId();
        this.seqId = testrunTestcaseGroup.getTestcaseGroup().getSeqId();
        this.parentId = testrunTestcaseGroup.getTestcaseGroup().getParentId();
        this.depth = testrunTestcaseGroup.getTestcaseGroup().getDepth();
        this.name = testrunTestcaseGroup.getTestcaseGroup().getName();
        this.description = testrunTestcaseGroup.getTestcaseGroup().getDescription();
        this.itemOrder = testrunTestcaseGroup.getTestcaseGroup().getItemOrder();

        if (testrunTestcaseGroup.getTestcases() != null && !testrunTestcaseGroup.getTestcases().isEmpty()) {
            this.testcases = testrunTestcaseGroup.getTestcases().stream().map(TestrunTestcaseGroupTestcaseResponse::new).collect(Collectors.toList());
        }
    }


}
