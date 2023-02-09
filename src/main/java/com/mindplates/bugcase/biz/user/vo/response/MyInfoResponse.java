package com.mindplates.bugcase.biz.user.vo.response;


import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.vo.response.SpaceListResponse;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
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
public class MyInfoResponse {

    private Long id;
    private String uuid;
    private SystemRole systemRole;
    private String token;
    private String email;
    private String name;
    private String language;
    private String country;
    private String timezone;
    private List<SpaceListResponse> spaces;

    public MyInfoResponse(UserDTO user, String token) {
        if (user != null) {
            this.id = user.getId();
            this.uuid = user.getUuid();
            this.email = user.getEmail();
            this.name = user.getName();
            this.systemRole = user.getSystemRole();
            this.language = user.getLanguage();
            this.country = user.getCountry();
            this.timezone = user.getTimezone();
        }

        this.token = token;
    }

    public MyInfoResponse(UserDTO user, String token, List<SpaceDTO> spaces) {
        this(user, token);
        if (spaces != null) {
            this.spaces = spaces.stream().map(SpaceListResponse::new).collect(Collectors.toList());
        }


    }
}
