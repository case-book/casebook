package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum ApprovalStatusCode {

    REQUEST("REQUEST"),
    REQUEST_AGAIN("REQUEST_AGAIN"),
    APPROVAL("APPROVAL"),
    REJECTED("REJECTED");
    private String code;

}
