package com.mindplates.bugcase.biz.admin.vo.response;


import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.vo.response.SpaceListResponse;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.SystemRole;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserDetailResponse {

    private Long id;
    private String email;
    private String name;
    private String uuid;
    private Boolean activateYn;
    private Boolean useYn;
    private String language;
    private String country;
    private SystemRole activeSystemRole;
    private Boolean autoLogin;
    private String timezone;
    private SystemRole systemRole;
    private String activationToken;
    private Boolean activateMailSendResult;
    private String recoveryToken;
    private Boolean recoveryMailSendResult;
    private String loginToken;
    private LocalDateTime lastSeen;
    private List<SpaceListResponse> spaces;

    public UserDetailResponse(UserDTO user) {
        if (user != null) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.name = user.getName();
            this.uuid = user.getUuid();
            this.activateYn = user.getActivateYn();
            this.useYn = user.getUseYn();
            this.language = user.getLanguage();
            this.country = user.getCountry();
            this.activeSystemRole = user.getActiveSystemRole();
            this.autoLogin = user.getAutoLogin();
            this.timezone = user.getTimezone();
            this.systemRole = user.getSystemRole();
            this.activationToken = user.getActivationToken();
            this.activateMailSendResult = user.getActivateMailSendResult();
            this.recoveryToken = user.getRecoveryToken();
            this.recoveryMailSendResult = user.getRecoveryMailSendResult();
            this.loginToken = user.getLoginToken();
            this.lastSeen = user.getLastSeen();
        }
    }

    public UserDetailResponse(UserDTO user, List<SpaceDTO> spaces) {
        this(user);
        if (spaces != null) {
            this.spaces = spaces.stream().map(SpaceListResponse::new).collect(Collectors.toList());
        }
    }
}
