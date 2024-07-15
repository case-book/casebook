package com.mindplates.bugcase.biz.testcase.vo.request;

import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class TestcaseNameDescriptionChangeRequest {

    @NotBlank
    @Length(min = 1, max = 100)
    private String name;

    private String description;

}
