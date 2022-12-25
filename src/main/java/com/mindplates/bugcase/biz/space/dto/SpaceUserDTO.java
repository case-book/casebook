package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.*;


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
