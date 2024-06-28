package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectApplicant;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectApplicantDTO extends CommonDTO implements IDTO<ProjectApplicant> {

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

    @Override
    public ProjectApplicant toEntity() {
        return ProjectApplicant.builder()
            .id(this.id)
            .user(UserDTO.builder().id(this.user.getId()).build().toEntity())
            .project(Project.builder().id(this.project.getId()).build())
            .approvalStatusCode(this.approvalStatusCode)
            .message(this.message)
            .build();
    }

    public ProjectApplicant toEntity(Project project) {
        ProjectApplicant projectApplicant = this.toEntity();
        projectApplicant.setProject(project);
        return projectApplicant;

    }
}
