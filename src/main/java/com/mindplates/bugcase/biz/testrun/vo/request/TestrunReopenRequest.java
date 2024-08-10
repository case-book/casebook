package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.common.code.TestrunReopenCreationTypeCode;
import com.mindplates.bugcase.common.code.TestrunReopenTestcaseCode;
import com.mindplates.bugcase.common.code.TestrunReopenTesterCode;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestrunReopenRequest {

    @NotNull
    private TestrunReopenCreationTypeCode testrunReopenCreationType;
    @NotNull
    private TestrunReopenTestcaseCode testrunReopenTestcase;
    @NotNull
    private TestrunReopenTesterCode testrunReopenTester;


}
