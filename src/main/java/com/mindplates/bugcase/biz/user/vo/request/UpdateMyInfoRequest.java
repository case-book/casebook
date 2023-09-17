package com.mindplates.bugcase.biz.user.vo.request;


import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.SystemRole;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdateMyInfoRequest {


    @NotBlank
    private String name;
    @NotBlank
    private String language;
    @NotBlank
    private String country;
    private String timezone;
    private SystemRole activeSystemRole;
    private String avatarInfo;

    public UserDTO toDTO() {
        return UserDTO.builder().name(name).country(country).language(language).timezone(timezone).activeSystemRole(activeSystemRole).avatarInfo(avatarInfo).build();
    }
}
