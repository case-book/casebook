package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.common.code.TestrunReopenCreationTypeCode;
import com.mindplates.bugcase.common.code.TestrunReopenTestResultCode;
import com.mindplates.bugcase.common.code.TestrunReopenTestcaseCode;
import com.mindplates.bugcase.common.code.TestrunReopenTesterCode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestrunReopenRequest {

    @NotNull
    private TestrunReopenCreationTypeCode testrunReopenCreationType;

    private TestrunReopenTestcaseCode testrunReopenTestcase;
    @NotNull
    private TestrunReopenTesterCode testrunReopenTester;
    @NotNull
    private TestrunReopenTestResultCode testrunReopenTestResult;
    @NotNull
    private String name;


}
