package com.mindplates.bugcase.biz.admin.vo.request;


import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdatePasswordRequest {


    @NotBlank
    private String nextPassword;
    @NotBlank
    private String nextPasswordConfirm;


}
