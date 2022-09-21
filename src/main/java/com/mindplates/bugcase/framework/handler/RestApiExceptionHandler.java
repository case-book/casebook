package com.mindplates.bugcase.framework.handler;

import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolationException;
import java.util.function.BiFunction;

@RestControllerAdvice
@Slf4j
public class RestApiExceptionHandler {

    final private MessageSourceAccessor messageSourceAccessor;

    final private BiFunction<HttpStatus, String, ResponseEntity<ErrorResponse>> messageResponse = ((code, message) ->
            new ResponseEntity<>(ErrorResponse.builder().code(code).message(message).build(), HttpStatus.BAD_REQUEST)
    );

    final private BiFunction<HttpStatus, String, ResponseEntity<ErrorResponse>> response = ((code, message) ->
            new ResponseEntity<>(ErrorResponse.builder().code(code).message(message).build(), code)
    );

    public RestApiExceptionHandler(MessageSourceAccessor messageSourceAccessor) {
        this.messageSourceAccessor = messageSourceAccessor;
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<?> handleServiceException(ServiceException e) {
        if (e.getMessageCode() != null) {
            String message = messageSourceAccessor.getMessage(e.getMessageCode(), e.getMessageParameters());
            return response.apply(e.getCode(), message);
        }

        return response.apply(e.getCode(), "");

    }


    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleServiceException(ConstraintViolationException e) {
        return messageResponse.apply(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleServiceException(RuntimeException e) {
        log.error(e.getMessage(), e);
        String message = messageSourceAccessor.getMessage("common.error.unknownError");
        return messageResponse.apply(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
}
