package com.mindplates.bugcase.biz.testrun.vo.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class TestrunTesterRequest {

    @NotNull
    private Long testerId;


}
