package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestrunIterationTimeTypeCode {

    MONTHLY("MONTHLY"),
    WEEKLY("WEEKLY"),
    MONTHLY_WEEKLY("MONTHLY_WEEKLY");
    private String code;

}
