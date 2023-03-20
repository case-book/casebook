package com.mindplates.bugcase.biz.project.vo.request;


import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;

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
}
