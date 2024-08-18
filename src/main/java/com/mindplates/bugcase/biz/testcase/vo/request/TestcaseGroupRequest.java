package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class TestcaseGroupRequest implements IRequestVO<TestcaseGroupDTO> {

    private Long id;
    private Long parentId;
    private Long depth;
    @NotBlank
    @Length(min = 1, max = 100)
    private String name;
    private Integer itemOrder;


    @Override
    public TestcaseGroupDTO toDTO() {
        return TestcaseGroupDTO.builder()
            .id(id)
            .parentId(parentId)
            .depth(depth)
            .name(name)
            .itemOrder(itemOrder)
            .build();
    }

    public TestcaseGroupDTO toDTO(long projectId) {
        TestcaseGroupDTO dto = toDTO();
        dto.setProject(ProjectDTO.builder().id(projectId).build());
        return dto;
    }
}
