package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectApplicantDTO extends CommonDTO {
    private Long id;
    private UserDTO user;
    private ProjectDTO project;
    private ApprovalStatusCode approvalStatusCode;
    private String message;
}
