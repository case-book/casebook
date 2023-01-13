package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class TestcaseGroupDTO extends CommonDTO {

    private Long id;
    private String seqId;
    private Long parentId;
    private Long depth;
    private String name;
    private String description;
    private Integer itemOrder;
    private ProjectDTO project;
    private List<TestcaseDTO> testcases;

    public TestcaseGroupDTO (TestcaseGroup testcaseGroup) {
        this.id = testcaseGroup.getId();
        this.seqId = testcaseGroup.getSeqId();
        this.parentId = testcaseGroup.getParentId();
        this.depth = testcaseGroup.getDepth();
        this.name = testcaseGroup.getName();
        this.description = testcaseGroup.getDescription();
        this.itemOrder = testcaseGroup.getItemOrder();
        this.project = ProjectDTO.builder().id(testcaseGroup.getProject().getId()).build();
        this.testcases = testcaseGroup.getTestcases().stream().map(TestcaseDTO::new).collect(Collectors.toList());

    }


}
