package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.common.code.TesterChangeTargetCode;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestrunTesterRandomChangeRequest {


    private Long testerId;

    @NotNull
    private Long targetId;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TesterChangeTargetCode target;

    @NotNull
    private String reason;


}
