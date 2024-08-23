package com.mindplates.bugcase.biz.user.vo.request;


import com.mindplates.bugcase.biz.user.dto.UserTokenDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserTokenRequest {


    @NotBlank
    private String name;
    private boolean enabled;

    public UserTokenDTO toDTO() {
        return UserTokenDTO.builder()
            .name(name)
            .enabled(enabled)
            .build();
    }
}
