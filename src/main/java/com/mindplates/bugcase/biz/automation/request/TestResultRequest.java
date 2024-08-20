package com.mindplates.bugcase.biz.automation.request;

import com.mindplates.bugcase.common.code.TestResultCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TestResultRequest {
    private TestResultCode result;
    private String comment;
}
