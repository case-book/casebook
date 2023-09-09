package com.mindplates.bugcase.biz.testcase.vo.request;

import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TestcaseReleaseChangeRequest {

    @NotEmpty
    private Long projectReleaseId;

}
