package com.mindplates.bugcase.biz.user.vo.request;


import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePasswordRequest {


    @NotBlank
    private String currentPassword;
    @NotBlank
    private String nextPassword;
    @NotBlank
    private String nextPasswordConfirm;


}
