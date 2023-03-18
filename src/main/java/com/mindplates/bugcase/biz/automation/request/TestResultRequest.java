package com.mindplates.bugcase.biz.automation.request;

import com.mindplates.bugcase.common.code.TestResultCode;
import lombok.Data;

@Data
public class TestResultRequest {
    private TestResultCode result;
    private String comment;
}
