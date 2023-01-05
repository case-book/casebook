package com.mindplates.bugcase.biz.user.vo.request;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank
    @Length(min = 2, max = 100)
    private String email;
    @NotBlank
    @Length(min = 2, max = 100)
    private String password;
    private Boolean autoLogin;

}
