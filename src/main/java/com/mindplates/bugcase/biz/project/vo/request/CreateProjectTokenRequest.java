package com.mindplates.bugcase.biz.project.vo.request;


import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateProjectTokenRequest {

    @NotBlank
    private String name;
    private boolean enabled;

    public ProjectTokenDTO toDTO(Long projectId) {
        return ProjectTokenDTO.builder()
            .project(ProjectDTO.builder().id(projectId).build())
            .name(name)
            .enabled(enabled)
            .build();
    }
}
