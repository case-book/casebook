package com.mindplates.bugcase.biz.admin.vo.request;


import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.SystemRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @NotBlank
    private String name;
    @NotBlank
    private String language;
    @NotBlank
    private String country;
    private String timezone;
    private SystemRole systemRole;
    private SystemRole activeSystemRole;
    private Boolean useYn;
    private Boolean activateYn;

    public UserDTO toDTO() {
        return UserDTO.builder().name(name).country(country).language(language).timezone(timezone).systemRole(systemRole).activeSystemRole(activeSystemRole).useYn(useYn).activateYn(activateYn)
            .build();
    }
}
