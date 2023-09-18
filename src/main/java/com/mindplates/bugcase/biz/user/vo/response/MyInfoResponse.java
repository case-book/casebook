package com.mindplates.bugcase.biz.user.vo.response;


import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.vo.response.SpaceListResponse;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.SystemRole;
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
public class MyInfoResponse {

    private Long id;
    private String uuid;
    private SystemRole systemRole;
    private SystemRole activeSystemRole;
    private String token;
    private String email;
    private String name;
    private String language;
    private String country;
    private String timezone;
    private List<SpaceListResponse> spaces;
    private String refreshToken;
    private String avatarInfo;

    public MyInfoResponse(UserDTO user, String token, String refreshToken) {
        if (user != null) {
            this.id = user.getId();
            this.uuid = user.getUuid();
            this.email = user.getEmail();
            this.name = user.getName();
            this.systemRole = user.getSystemRole();
            this.activeSystemRole = user.getActiveSystemRole();
            this.language = user.getLanguage();
            this.country = user.getCountry();
            this.timezone = user.getTimezone();
            this.avatarInfo = user.getAvatarInfo();
        }
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public MyInfoResponse(UserDTO user, String token, String refreshToken, List<SpaceDTO> spaces) {
        this(user, token, refreshToken);
        if (spaces != null) {
            this.spaces = spaces.stream().map(SpaceListResponse::new).collect(Collectors.toList());
        }
    }

}
