package com.mindplates.bugcase.biz.user.vo.request;


import com.mindplates.bugcase.biz.user.dto.UserTokenDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UpdateUserTokenRequest {

    @NotNull
    private Long id;
    @NotBlank
    private String name;
    private boolean enabled;

    public UserTokenDTO toDTO() {
        return UserTokenDTO.builder()
                .id(id)
                .name(name)
                .enabled(enabled)
                .build();
    }
}
