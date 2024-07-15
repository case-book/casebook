package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class TestcaseGroupDTO extends CommonDTO implements IDTO<TestcaseGroup> {

    private Long id;
    private String seqId;
    private Long parentId;
    private Long depth;
    private String name;
    private String description;
    private Integer itemOrder;
    private ProjectDTO project;
    private List<TestcaseDTO> testcases;

    public TestcaseGroupDTO(TestcaseGroup testcaseGroup) {
        this.id = testcaseGroup.getId();
        this.seqId = testcaseGroup.getSeqId();
        this.parentId = testcaseGroup.getParentId();
        this.depth = testcaseGroup.getDepth();
        this.name = testcaseGroup.getName();
        this.description = testcaseGroup.getDescription();
        this.itemOrder = testcaseGroup.getItemOrder();
        this.project = ProjectDTO.builder().id(testcaseGroup.getProject().getId()).build();
        if (testcaseGroup.getTestcases() != null) {
            this.testcases = testcaseGroup.getTestcases().stream().map(TestcaseDTO::new).collect(Collectors.toList());
        }

    }


    @Override
    public TestcaseGroup toEntity() {
        TestcaseGroup testcaseGroup = TestcaseGroup.builder()
            .id(this.id)
            .seqId(this.seqId)
            .parentId(this.parentId)
            .depth(this.depth)
            .name(this.name)
            .description(this.description)
            .itemOrder(this.itemOrder)
            .project(this.project.toEntity())
            .build();

        if (this.testcases != null) {
            testcaseGroup.setTestcases(this.testcases.stream().map(TestcaseDTO::toEntity).collect(Collectors.toList()));
        }

        return testcaseGroup;
    }

    public TestcaseGroup toEntity(Project project) {
        TestcaseGroup testcaseGroup = toEntity();
        testcaseGroup.setProject(project);
        return testcaseGroup;

    }

    public String getDefaultName(int groupSeq) {
        return this.name + "-" + groupSeq;
    }


}
