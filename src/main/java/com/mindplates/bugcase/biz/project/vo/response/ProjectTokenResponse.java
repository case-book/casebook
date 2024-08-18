package com.mindplates.bugcase.biz.project.vo.response;


import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ProjectTokenResponse {

    private Long id;
    private Long projectId;
    private String name;
    private String token;
    private boolean enabled;
    private LocalDateTime lastAccess;

    public ProjectTokenResponse(ProjectTokenDTO projectTokenDTO) {
        if (projectTokenDTO != null) {
            this.id = projectTokenDTO.getId();
            this.projectId = projectTokenDTO.getProject().getId();
            this.name = projectTokenDTO.getName();
            this.token = projectTokenDTO.getToken();
            this.enabled = projectTokenDTO.isEnabled();
            this.lastAccess = projectTokenDTO.getLastAccess();
        }
    }

}
