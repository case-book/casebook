package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum FileSourceTypeCode {

    PROJECT("PROJECT"),
    TESTCASE("TESTCASE"),
    TESTRUN("TESTRUN");
    private String code;

}
