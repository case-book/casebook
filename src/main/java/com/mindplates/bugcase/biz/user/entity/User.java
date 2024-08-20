package com.mindplates.bugcase.biz.user.entity;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.SystemRole;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@Table(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "email", nullable = false, length = ColumnsDef.EMAIL)
    private String email;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "password", nullable = false, length = ColumnsDef.PASSWORD)
    private String password;

    @Column(name = "salt", nullable = false, length = ColumnsDef.TOKEN)
    private String salt;

    @Column(name = "activate_yn", nullable = false)
    private Boolean activateYn;

    @Column(name = "use_yn", nullable = false)
    private Boolean useYn;

    @Column(name = "language", length = ColumnsDef.CODE)
    private String language;

    @Column(name = "country", length = ColumnsDef.CODE)
    private String country;

    @Column(name = "activation_token", length = ColumnsDef.TOKEN)
    private String activationToken;

    @Column(name = "activate_mail_send_result")
    private Boolean activateMailSendResult;

    @Column(name = "recovery_token", length = ColumnsDef.TOKEN)
    private String recoveryToken;

    @Column(name = "recovery_mail_send_result")
    private Boolean recoveryMailSendResult;

    @Column(name = "role_code", length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private SystemRole systemRole;

    @Column(name = "active_role_code", length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private SystemRole activeSystemRole;

    @Column(name = "auto_login")
    private Boolean autoLogin;

    @Column(name = "loginToken", length = ColumnsDef.TOKEN)
    private String loginToken;

    @Column(name = "timezone", length = ColumnsDef.CODE)
    private String timezone;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "avatar_info", length = ColumnsDef.TEXT)
    private String avatarInfo;

    public User(Long id, SystemRole activeSystemRole, String name, String email, String language) {
        this.id = id;
        this.activeSystemRole = activeSystemRole;
        this.name = name;
        this.email = email;
        this.language = language;
    }

    public void update(UserDTO user, boolean isAdmin) {
        this.name = user.getName();
        this.language = user.getLanguage();
        this.country = user.getCountry();
        this.timezone = user.getTimezone();
        this.avatarInfo = user.getAvatarInfo();
        if (this.systemRole.equals(SystemRole.ROLE_ADMIN)) {
            this.activeSystemRole = user.getActiveSystemRole();
        }

        if (isAdmin) {
            this.systemRole = user.getSystemRole();
            this.useYn = user.getUseYn();
            this.activateYn = user.getActivateYn();
        }
    }

}
