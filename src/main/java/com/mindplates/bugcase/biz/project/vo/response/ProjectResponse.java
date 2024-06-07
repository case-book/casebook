package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateResponse;
import com.mindplates.bugcase.biz.user.vo.response.SimpleMemberResponse;
import com.mindplates.bugcase.common.code.UserRoleCode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
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
    private List<ProjectReleaseResponse> projectReleases;
    private List<ProjectMessageChannelResponse> messageChannels;

    public ProjectResponse(ProjectDTO project, Long userId) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.token = project.getToken();
        this.activated = project.isActivated();
        this.creationDate = project.getCreationDate();

        if (project.getSpace() != null) {
            this.spaceName = project.getSpace().getName();
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
                            .avatarInfo(projectUser.getUser().getAvatarInfo())
                            .build()).collect(Collectors.toList());

            if (userId != null && project.getUsers().stream()
                .anyMatch(projectUser -> projectUser.getUser().getId().equals(userId) && UserRoleCode.ADMIN.equals(projectUser.getRole()))) {
                this.isAdmin = true;
            }
        }

        if (project.getTestcaseTemplates() != null && !project.getTestcaseTemplates().isEmpty()) {
            this.testcaseTemplates = project.getTestcaseTemplates().stream().map(TestcaseTemplateResponse::new).collect(Collectors.toList());
        }

        if (project.getTestcaseGroups() != null && !project.getTestcaseGroups().isEmpty()) {
            this.testcaseGroups = project.getTestcaseGroups().stream().map(TestcaseGroupResponse::new).collect(Collectors.toList());
        }

        if (project.getProjectReleases() != null) {
            this.projectReleases = project.getProjectReleases()
                .stream()
                .map(projectReleaseDTO -> ProjectReleaseResponse.builder()
                    .id(projectReleaseDTO.getId())
                    .name(projectReleaseDTO.getName())
                    .build())
                .collect(Collectors.toList());
        }

        if (project.getMessageChannels() != null) {
            this.messageChannels = project.getMessageChannels().stream().map(ProjectMessageChannelResponse::new).collect(Collectors.toList());
        }

    }
}
