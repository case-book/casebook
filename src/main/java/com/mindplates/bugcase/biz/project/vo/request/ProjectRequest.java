package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.project.entity.Project;
import lombok.Data;

@Data
public class ProjectRequest {

    private Long id;
    private String name;
    private String description;
    private String token;
    private Boolean activated;


    public Project buildEntity() {

        Project project = Project.builder()
                .id(id)
                .name(name)
                .description(description)
                .token(token)

                .activated(activated)
                .build();

        
        return project;
    }


}
