package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class SpaceJoinRequest implements IRequestVO<SpaceApplicantDTO> {

    private String message;

    public SpaceApplicantDTO toDTO(String spaceCode, Long userId) {

        return SpaceApplicantDTO.builder()
            .user(UserDTO.builder().id(userId).build())
            .space(SpaceDTO.builder().code(spaceCode).build())
            .message(message)
            .build();
    }

    public SpaceApplicantDTO toDTO() {
        return toDTO(null, null);
    }

}
