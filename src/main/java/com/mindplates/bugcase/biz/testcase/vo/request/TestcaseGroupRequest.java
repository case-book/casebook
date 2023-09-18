package com.mindplates.bugcase.biz.testcase.vo.request;

import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class TestcaseGroupRequest {

    private Long id;
    private Long parentId;
    private Long depth;
    @NotBlank
    @Length(min = 1, max = 100)
    private String name;
    private Integer itemOrder;

}
