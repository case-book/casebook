package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestrunIterationUserFilterTypeCode {

    NONE("NONE"),
    TESTRUN("TESTRUN"),
    WEEKLY("WEEKLY"),
    MONTHLY("MONTHLY");
    private String code;

}
