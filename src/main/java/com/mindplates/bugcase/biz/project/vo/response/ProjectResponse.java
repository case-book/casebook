package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateResponse;
import com.mindplates.bugcase.biz.user.vo.response.SimpleMemberResponse;
import com.mindplates.bugcase.common.code.UserRoleCode;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private String token;
    private Boolean activated;
    private LocalDateTime creationDate;
    private String spaceName;
    private List<TestcaseTemplateResponse> testcaseTemplates;
    private List<TestcaseGroupResponse> testcaseGroups;
    private List<SimpleMemberResponse> users;

    private boolean isAdmin = false;

    public ProjectResponse(ProjectDTO project, Long userId) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.token = project.getToken();
        this.activated = project.isActivated();
        this.creationDate = project.getCreationDate();
        this.spaceName = project.getSpace().getName();

        if (userId != null && project.getUsers().stream().anyMatch(projectUser -> projectUser.getUser().getId().equals(userId) && UserRoleCode.ADMIN.equals(projectUser.getRole()))) {
            this.isAdmin = true;
        }

        if (project.getUsers() != null) {
            this.users = project.getUsers().stream().map(
                    (projectUser) -> SimpleMemberResponse.builder()
                            .id(projectUser.getId())
                            .userId(projectUser.getUser().getId())
                            .role(projectUser.getRole())
                            .email(projectUser.getUser().getEmail())
                            .name(projectUser.getUser().getName())
                            .tags(projectUser.getTags())
                            .build()).collect(Collectors.toList());
        }

        if (project.getTestcaseTemplates() != null && !project.getTestcaseTemplates().isEmpty()) {
            this.testcaseTemplates = project.getTestcaseTemplates().stream().map(TestcaseTemplateResponse::new).collect(Collectors.toList());
        }

        if (project.getTestcaseGroups() != null && !project.getTestcaseGroups().isEmpty()) {
            this.testcaseGroups = project.getTestcaseGroups().stream().map(TestcaseGroupResponse::new).collect(Collectors.toList());
        }
    }
}
