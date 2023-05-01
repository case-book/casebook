package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestrunIterationTimeTypeCode {

    MONTHLY("MONTHLY"),
    WEEEKLY("WEEEKLY");
    private String code;

}
