package com.mindplates.bugcase.biz.user.vo.request;


import com.mindplates.bugcase.biz.user.dto.UserTokenDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateUserTokenRequest {
    @NotBlank
    private String name;
    private String token;

    public UserTokenDTO toDTO() {
        return UserTokenDTO.builder()
                .name(name)
                .token(token)
                .build();
    }
}
