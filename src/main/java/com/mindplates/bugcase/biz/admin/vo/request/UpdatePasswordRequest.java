package com.mindplates.bugcase.biz.admin.vo.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePasswordRequest {


    @NotBlank
    private String nextPassword;
    @NotBlank
    private String nextPasswordConfirm;


}
