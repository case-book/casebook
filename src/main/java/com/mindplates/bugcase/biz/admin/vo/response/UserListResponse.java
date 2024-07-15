package com.mindplates.bugcase.biz.admin.vo.response;


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
public class UserListResponse {

    private Long id;
    private String email;
    private String name;
    private String uuid;
    private Boolean activateYn;
    private Boolean useYn;
    private String language;
    private String country;
    private SystemRole activeSystemRole;
    private String timezone;
    private SystemRole systemRole;
    private List<SpaceListResponse> spaces;

    public UserListResponse(UserDTO user) {
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
            this.useYn = user.getUseYn();
            this.activateYn = user.getActivateYn();
        }
    }

    public UserListResponse(UserDTO user, List<SpaceDTO> spaces) {
        this(user);
        if (spaces != null) {
            this.spaces = spaces.stream().map((SpaceListResponse::new)).collect(Collectors.toList());
        }


    }
}
