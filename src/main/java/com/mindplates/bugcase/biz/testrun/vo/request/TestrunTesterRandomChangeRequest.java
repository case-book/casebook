package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.common.code.TesterChangeTargetCode;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestrunTesterRandomChangeRequest {

    @NotNull
    private Long testerId;

    @NotNull
    private Long targetId;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TesterChangeTargetCode target;

    @NotNull
    private String reason;


}
