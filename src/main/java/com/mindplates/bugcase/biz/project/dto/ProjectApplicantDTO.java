package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.ProjectApplicant;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
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

    public ProjectApplicantDTO(ProjectApplicant projectApplicant) {
        this.id = projectApplicant.getId();
        this.user = new UserDTO(projectApplicant.getUser());
        this.project = ProjectDTO.builder().id(projectApplicant.getProject().getId()).build();
        this.approvalStatusCode = projectApplicant.getApprovalStatusCode();
        this.message = projectApplicant.getMessage();
    }
}
