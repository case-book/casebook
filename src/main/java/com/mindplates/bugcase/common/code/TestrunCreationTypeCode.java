package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestrunCreationTypeCode {

    CREATE("CREATE"),
    RESERVE("RESERVE"),
    ITERATION("ITERATION");
    private String code;

}
