package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectTokenDTO extends CommonDTO implements IDTO<ProjectToken> {

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

    @Override
    public ProjectToken toEntity() {
        ProjectToken projectToken = ProjectToken.builder()
            .name(this.name)
            .enabled(this.enabled)
            .build();

        if (this.project != null) {
            projectToken.setProject(Project.builder().id(this.project.getId()).build());
        }

        return projectToken;
    }


    public ProjectToken toEntity(long projectId) {
        ProjectToken projectToken = toEntity();
        projectToken.setProject(Project.builder().id(projectId).build());
        return projectToken;
    }
}
