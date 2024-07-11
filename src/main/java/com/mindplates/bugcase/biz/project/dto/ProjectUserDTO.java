package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.UserRoleCode;
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
public class ProjectUserDTO extends CommonDTO implements IDTO<ProjectUser> {

    private Long id;
    private UserRoleCode role;
    private UserDTO user;
    private ProjectDTO project;
    private String tags;
    private String crud;

    public ProjectUserDTO(ProjectUser projectUser) {
        this.id = projectUser.getId();
        this.role = projectUser.getRole();
        this.user = new UserDTO(projectUser.getUser());
        this.project = ProjectDTO.builder().id(projectUser.getProject().getId()).build();
        this.tags = projectUser.getTags();
        this.crud = projectUser.getCrud();
    }

    @Override
    public ProjectUser toEntity() {
        return ProjectUser.builder()
            .id(this.id)
            .role(this.role)
            .user(User.builder().id(this.user.getId()).build())
            .project(Project.builder().id(this.project.getId()).build())
            .tags(this.tags)
            .crud(this.crud)
            .build();
    }

    public ProjectUser toEntity(Project project) {
        ProjectUser projectUser = this.toEntity();
        projectUser.setProject(project);
        return projectUser;
    }

    public void updateInfo(ProjectUserDTO updateProjectUser) {
        this.role = updateProjectUser.getRole();
        this.tags = updateProjectUser.getTags();
    }
}
