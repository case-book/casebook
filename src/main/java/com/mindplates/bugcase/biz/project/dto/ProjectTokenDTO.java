package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import java.time.LocalDateTime;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectTokenDTO extends CommonDTO {

    private Long id;
    private ProjectDTO project;
    private String name;
    private String token;
    private boolean enabled;
    private LocalDateTime lastAccess;

    public ProjectTokenDTO(ProjectToken projectToken) {
        this.id = projectToken.getId();
        this.project = ProjectDTO.builder().id(projectToken.getProject().getId()).build();
        this.name = projectToken.getName();
        this.token = projectToken.getToken();
        this.enabled = projectToken.isEnabled();
        this.lastAccess = projectToken.getLastAccess();
    }

}
