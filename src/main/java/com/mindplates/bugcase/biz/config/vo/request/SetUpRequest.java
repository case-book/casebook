package com.mindplates.bugcase.biz.config.vo.request;


import com.mindplates.bugcase.biz.user.dto.UserDTO;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SetUpRequest {

    private AdminUser adminUser;


    @Data
    public static class AdminUser {

        @NotBlank
        @Email
        private String email;
        @NotBlank
        private String name;
        private String country;
        private String language;
        @NotBlank
        private String password;

        public UserDTO toDTO() {
            return UserDTO.builder().email(email).name(name).country(country).language(language).password(password).build();
        }
    }
}
