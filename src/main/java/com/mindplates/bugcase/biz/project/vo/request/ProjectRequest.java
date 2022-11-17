package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.project.entity.Project;
import lombok.Data;

import java.util.List;

@Data
public class ProjectRequest {

    private Long id;
    private String name;
    private String description;
    private String token;
    private Boolean activated;

    private List<TestcaseTemplateRequest> testcaseTemplates;

    public Project buildEntity() {

        Project project = Project.builder()
                .id(id)
                .name(name)
                .description(description)
                .token(token)
                .activated(activated)
                .build();

        /*
        project.setTestcaseTemplates(testcaseTemplates.stream().map((testcaseTemplateRequest -> {
            TestcaseTemplate testcaseTemplate = testcaseTemplateRequest.buildEntity();
            testcaseTemplate.setProject(project);
            return testcaseTemplate;
        })).collect(Collectors.toList()));

         */

        return project;
    }


}
