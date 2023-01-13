package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceUserDTO extends CommonDTO {

    private Long id;
    private UserRoleCode role;
    private UserDTO user;
    private SpaceDTO space;
    private String crud;
    public SpaceUserDTO (SpaceUser spaceUser) {
        this.id = spaceUser.getId();
        this.role = spaceUser.getRole();
        this.user = new UserDTO(spaceUser.getUser());
        this.space = SpaceDTO.builder().id(spaceUser.getSpace().getId()).build();
        this.crud = spaceUser.getCrud();
    }

}
