package com.mindplates.bugcase.biz.user.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleMemberResponse {

    private Long id;
    private Long userId;
    private UserRoleCode role;
    private String email;
    private String name;

    private String tags;

    public SimpleMemberResponse(SpaceUserDTO spaceUser) {
        this.id = spaceUser.getId();
        this.userId = spaceUser.getUser().getId();
        this.role = spaceUser.getRole();
        this.email = spaceUser.getUser().getEmail();
        this.name = spaceUser.getUser().getName();
    }
}
