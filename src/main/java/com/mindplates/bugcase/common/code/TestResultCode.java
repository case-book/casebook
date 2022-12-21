package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestResultCode {

    UNTESTED("UNTESTED"),
    UNTESTABLE("UNTESTABLE"),
    FAILED("FAILED"),
    PASSED("PASSED");
    private String code;

}
