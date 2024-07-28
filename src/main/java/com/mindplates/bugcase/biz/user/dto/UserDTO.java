package com.mindplates.bugcase.biz.user.dto;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.SystemRole;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO extends CommonDTO implements IDTO<User> {

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
    private String avatarInfo;

    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.uuid = user.getUuid();
        this.password = user.getPassword();
        this.salt = user.getSalt();
        this.activateYn = user.getActivateYn();
        this.useYn = user.getUseYn();
        this.language = user.getLanguage();
        this.country = user.getCountry();
        this.activationToken = user.getActivationToken();
        this.activateMailSendResult = user.getActivateMailSendResult();
        this.recoveryToken = user.getRecoveryToken();
        this.recoveryMailSendResult = user.getRecoveryMailSendResult();
        this.systemRole = user.getSystemRole();
        this.activeSystemRole = user.getActiveSystemRole();
        this.autoLogin = user.getAutoLogin();
        this.loginToken = user.getLoginToken();
        this.timezone = user.getTimezone();
        this.lastSeen = user.getLastSeen();
        this.avatarInfo = user.getAvatarInfo();
    }

    @Override
    public User toEntity() {
        return User.builder()
            .id(this.id)
            .email(this.email)
            .name(this.name)
            .uuid(this.uuid)
            .password(this.password)
            .salt(this.salt)
            .activateYn(this.activateYn)
            .useYn(this.useYn)
            .language(this.language)
            .country(this.country)
            .activationToken(this.activationToken)
            .activateMailSendResult(this.activateMailSendResult)
            .recoveryToken(this.recoveryToken)
            .recoveryMailSendResult(this.recoveryMailSendResult)
            .systemRole(this.systemRole)
            .activeSystemRole(this.activeSystemRole)
            .autoLogin(this.autoLogin)
            .loginToken(this.loginToken)
            .timezone(this.timezone)
            .lastSeen(this.lastSeen)
            .avatarInfo(this.avatarInfo)
            .build();

    }
}
