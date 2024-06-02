package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum PayloadTypeCode {

    FORM_DATA("FORM_DATA"),
    JSON("JSON");
    private String code;

}
