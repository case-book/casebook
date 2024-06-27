package com.mindplates.bugcase.biz.user.vo.response;


import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.vo.response.SpaceListResponse;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.SystemRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MyDetailInfoResponse {

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
    private List<SpaceListResponse> spaces;
    private String avatarInfo;

    public MyDetailInfoResponse(UserDTO user) {
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
            this.avatarInfo = user.getAvatarInfo();
        }
    }

    public MyDetailInfoResponse(UserDTO user, List<SpaceDTO> spaces) {
        this(user);
        if (spaces != null) {
            this.spaces = spaces.stream().map(SpaceListResponse::new).collect(Collectors.toList());
        }
    }
}
