package com.mindplates.bugcase.biz.user.vo.request;

import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

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
