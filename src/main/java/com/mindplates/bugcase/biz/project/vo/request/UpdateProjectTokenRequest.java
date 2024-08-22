package com.mindplates.bugcase.biz.project.vo.request;


import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProjectTokenRequest {


    @NotBlank
    private String name;
    private boolean enabled;

    public ProjectTokenDTO toDTO() {
        return ProjectTokenDTO.builder()
            .name(name)
            .enabled(enabled)
            .build();
    }

    public ProjectTokenDTO toDTO(long tokenId, long projectId) {
        return ProjectTokenDTO.builder()
            .id(tokenId)
            .project(ProjectDTO.builder().id(projectId).build())
            .name(name)
            .enabled(enabled)
            .build();
    }
}
