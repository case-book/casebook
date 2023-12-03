package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseTemplateRequest;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProjectCreateRequest implements IRequestVO<ProjectDTO> {

    private Long id;
    private String name;
    private String description;
    private boolean activated;
    private String token;
    private List<TestcaseTemplateRequest> testcaseTemplates;
    private List<ProjectUserRequest> users;
    private String slackUrl;
    private boolean enableTestrunAlarm;
    private Long targetReleaseId;

    public ProjectDTO toDTO() {

        ProjectDTO project = ProjectDTO.builder()
                .id(id)
                .name(name)
                .description(description)
                .token(token)
                .activated(activated)
                .slackUrl(slackUrl)
                .enableTestrunAlarm(enableTestrunAlarm)
                .build();

        if (users != null) {
            project.setUsers(users.stream().map((projectUser) -> projectUser.toDTO(project)).collect(Collectors.toList()));
        }

        if (testcaseTemplates != null) {
            project.setTestcaseTemplates(testcaseTemplates.stream().map((testcaseTemplateRequest -> testcaseTemplateRequest.toDTO(project))).collect(Collectors.toList()));
        }

        return project;
    }


}
