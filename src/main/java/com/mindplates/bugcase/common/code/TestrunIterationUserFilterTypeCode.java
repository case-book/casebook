package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestrunIterationUserFilterTypeCode {

    TESTRUN("TESTRUN"),
    WEEEKLY("WEEEKLY"),
    MONTHLY("MONTHLY");
    private String code;

}
