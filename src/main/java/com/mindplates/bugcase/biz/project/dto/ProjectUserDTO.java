package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectUserDTO extends CommonDTO {

    private Long id;
    private UserRoleCode role;
    private UserDTO user;
    private ProjectDTO project;
    private String tags;
    private String crud;

    public ProjectUserDTO (ProjectUser projectUser) {
        this.id = projectUser.getId();
        this.role = projectUser.getRole();
        this.user = new UserDTO(projectUser.getUser());
        this.project = ProjectDTO.builder().id(projectUser.getProject().getId()).build();
        this.tags = projectUser.getTags();
        this.crud = projectUser.getCrud();
    }
}
