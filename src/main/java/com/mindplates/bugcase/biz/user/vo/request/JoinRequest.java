package com.mindplates.bugcase.biz.user.vo.request;


import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class JoinRequest {

    private Long id;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String name;
    private String phone;
    private String country;
    private String language;
    @NotBlank
    private String password;


    public UserDTO toDTO() {
        return UserDTO.builder().id(id).email(email).name(name).country(country).language(language).password(password).build();
    }
}
