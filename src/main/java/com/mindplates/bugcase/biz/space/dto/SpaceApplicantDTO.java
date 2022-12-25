package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

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



}
