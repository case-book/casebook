package com.mindplates.bugcase.biz.user.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import com.mindplates.bugcase.common.entity.RoleCode;
import lombok.*;

import javax.persistence.*;

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
    private RoleCode roleCode;

    @Column(name = "active_role_code", length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private RoleCode activeRoleCode;

    @Column(name = "auto_login")
    private Boolean autoLogin;

    @Column(name = "loginToken", length = ColumnsDef.TOKEN)
    private String loginToken;

    @Column(name = "timezone", length = ColumnsDef.CODE)
    private String timezone;

}
