package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class TestcaseGroupUpdateRequest implements IRequestVO<TestcaseGroupDTO> {

    private Long id;
    @NotBlank
    @Length(min = 1, max = 100)
    private String name;

    private String description;


    @Override
    public TestcaseGroupDTO toDTO() {
        return TestcaseGroupDTO.builder()
            .id(id)
            .name(name)
            .description(description)
            .build();
    }
}
