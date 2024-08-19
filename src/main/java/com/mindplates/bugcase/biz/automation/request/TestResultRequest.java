package com.mindplates.bugcase.biz.automation.request;

import com.mindplates.bugcase.common.code.TestResultCode;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TestResultRequest {
    private TestResultCode result;
    private String comment;
}
