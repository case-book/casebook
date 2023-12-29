package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestrunHookTiming {

    BEFORE_START("BEFORE_START"),
    AFTER_START("AFTER_START"),
    HALF("HALF"),
    BEFORE_END("BEFORE_END"),
    AFTER_END("AFTER_END");
    private String timing;

}
