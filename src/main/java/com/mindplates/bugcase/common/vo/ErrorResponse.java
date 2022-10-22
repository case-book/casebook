package com.mindplates.bugcase.common.vo;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Builder
@Getter
public class ErrorResponse {

  private HttpStatus code;
  private String message;

  public ErrorResponse(HttpStatus code, String message) {
    this.code = code;
    this.message = message;
  }
}
