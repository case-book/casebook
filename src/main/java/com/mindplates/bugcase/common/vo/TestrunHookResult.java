package com.mindplates.bugcase.common.vo;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Builder
@Getter
public class TestrunHookResult {

    private HttpStatus code;
    private String message;

    public TestrunHookResult(HttpStatus code, String message) {
        this.code = code;
        this.message = message;
    }
}
