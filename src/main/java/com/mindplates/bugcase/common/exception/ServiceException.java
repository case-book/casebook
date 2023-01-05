package com.mindplates.bugcase.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ServiceException extends CommonException {

    private final HttpStatus code;
    private String messageCode;
    private String[] messageParameters;

    public ServiceException(HttpStatus code) {
        this.code = code;
    }

    public ServiceException(String messageCode) {
        this.code = HttpStatus.INTERNAL_SERVER_ERROR;
        this.messageCode = messageCode;
    }

    public ServiceException(HttpStatus code, String messageCode) {
        this.code = code;
        this.messageCode = messageCode;
    }

    public ServiceException(HttpStatus code, String messageCode, String[] messageParameters) {
        this.code = code;
        this.messageCode = messageCode;
        this.messageParameters = messageParameters;
    }

    public ServiceException(String messageCode, String[] messageParameters) {
        this.code = HttpStatus.INTERNAL_SERVER_ERROR;
        this.messageCode = messageCode;
        this.messageParameters = messageParameters;
    }
}
