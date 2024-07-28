package com.mindplates.bugcase.biz.testrun.vo.request;

import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestrunTesterRequest {

    @NotNull
    private Long testerId;


}
