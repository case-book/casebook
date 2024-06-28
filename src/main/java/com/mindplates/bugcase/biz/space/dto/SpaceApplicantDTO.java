package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceApplicantDTO extends CommonDTO implements IDTO<SpaceApplicant> {

    private Long id;
    private UserDTO user;
    private SpaceDTO space;
    private ApprovalStatusCode approvalStatusCode;
    private String message;

    public SpaceApplicantDTO(SpaceApplicant spaceApplicant) {
        this.id = spaceApplicant.getId();
        this.user = new UserDTO(spaceApplicant.getUser());
        this.space = SpaceDTO.builder().id(spaceApplicant.getSpace().getId()).build();
        this.approvalStatusCode = spaceApplicant.getApprovalStatusCode();
        this.message = spaceApplicant.getMessage();
    }


    @Override
    public SpaceApplicant toEntity() {
        return SpaceApplicant.builder()
            .id(id)
            .user(User.builder().id(user.getId()).build())
            .space(Space.builder().id(space.getId()).build())
            .approvalStatusCode(approvalStatusCode)
            .message(message)
            .build();
    }

    public SpaceApplicant toEntity(Space space) {

        SpaceApplicant spaceApplicant = toEntity();
        spaceApplicant.setSpace(space);
        return spaceApplicant;

    }
}
