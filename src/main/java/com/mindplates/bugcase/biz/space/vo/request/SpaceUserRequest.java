package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class SpaceUserRequest implements IRequestVO<SpaceUserDTO> {

    private Long id;
    private UserRoleCode role;
    private Long userId;
    private String crud;

    @Override
    public SpaceUserDTO toDTO() {
        return toDTO(null);
    }

    public SpaceUserDTO toDTO(SpaceDTO space) {
        return SpaceUserDTO.builder()
            .id(id)
            .role(role)
            .user(UserDTO.builder().id(userId).build())
            .crud(crud)
            .space(space)
            .build();
    }
}
