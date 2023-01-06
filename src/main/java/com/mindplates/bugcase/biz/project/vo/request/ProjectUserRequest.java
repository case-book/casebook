package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class ProjectUserRequest implements IRequestVO<ProjectUserDTO> {

    private Long id;
    private String crud;
    private Long userId;
    private UserRoleCode role;

    private String tags;

    public ProjectUserDTO toDTO() {
        return toDTO(null);
    }

    public ProjectUserDTO toDTO(ProjectDTO project) {
        return ProjectUserDTO.builder()
                .id(id)
                .user(UserDTO.builder().id(userId).build())
                .role(role)
                .crud(crud)
                .tags(tags)
                .project(project).build();
    }
}
