package com.mindplates.bugcase.biz.space.dto;

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

}
