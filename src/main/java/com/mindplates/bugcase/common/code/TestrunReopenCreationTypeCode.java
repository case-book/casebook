package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestrunReopenCreationTypeCode {

    REOPEN("REOPEN"),
    COPY("COPY");
    private String code;

}
