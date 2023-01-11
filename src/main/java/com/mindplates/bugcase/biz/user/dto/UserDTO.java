package com.mindplates.bugcase.biz.user.dto;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.SystemRole;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import java.time.LocalDateTime;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO extends CommonEntity {

    private Long id;

    private String email;

    private String name;

    private String uuid;

    private String password;

    private String salt;

    private Boolean activateYn;

    private Boolean useYn;

    private String language;

    private String country;

    private String activationToken;

    private Boolean activateMailSendResult;

    private String recoveryToken;

    private Boolean recoveryMailSendResult;

    private SystemRole systemRole;

    private SystemRole activeSystemRole;

    private Boolean autoLogin;

    private String loginToken;

    private String timezone;

    private LocalDateTime lastSeen;

    public UserDTO (User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
    }

}
