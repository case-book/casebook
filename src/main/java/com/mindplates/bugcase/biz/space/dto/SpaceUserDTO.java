package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class SpaceUserDTO extends CommonDTO implements IDTO<SpaceUser> {

    private Long id;
    private UserRoleCode role;
    private UserDTO user;
    private SpaceDTO space;
    private String crud;

    public SpaceUserDTO(SpaceUser spaceUser) {
        this.id = spaceUser.getId();
        this.role = spaceUser.getRole();
        this.user = new UserDTO(spaceUser.getUser());
        this.space = SpaceDTO.builder().id(spaceUser.getSpace().getId()).build();
        this.crud = spaceUser.getCrud();
    }

    @Override
    public SpaceUser toEntity() {
        return SpaceUser.builder()
            .id(id)
            .role(role)
            .user(User.builder().id(user.getId()).build())
            .space(Space.builder().id(space.getId()).build())
            .crud(crud)
            .build();
    }

    public SpaceUser toEntity(Space space) {
        SpaceUser spaceUser = toEntity();
        spaceUser.setSpace(space);
        return spaceUser;

    }
}
