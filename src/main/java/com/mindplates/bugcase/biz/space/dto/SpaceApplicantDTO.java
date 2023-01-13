package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.util.SessionUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.stream.Collectors;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceApplicantDTO extends CommonDTO {

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


}
