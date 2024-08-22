package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.ai.vo.response.LlmResponse;
import com.mindplates.bugcase.biz.project.dto.ProjectListDTO;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.user.vo.response.SimpleMemberResponse;
import com.mindplates.bugcase.common.code.UserRoleCode;
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
public class SpaceResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private boolean activated;
    private String token;
    private List<SimpleMemberResponse> users;
    private List<SpaceApplicantResponse> applicants;
    private List<SpaceMessageChannelResponse> messageChannels;
    private List<ProjectListResponse> projects;
    private List<HolidayResponse> holidays;

    private Long projectCount;
    private boolean allowSearch;
    private boolean allowAutoJoin;
    private boolean isAdmin;
    private String country;
    private String timeZone;

    private List<LlmResponse> llms;
    private List<SpaceLlmPromptResponse> llmPrompts;

    public SpaceResponse(SpaceDTO space) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.isActivated();
        this.description = space.getDescription();
        this.allowSearch = space.isAllowSearch();
        this.allowAutoJoin = space.isAllowAutoJoin();
        this.timeZone = space.getTimeZone();
        this.country = space.getCountry();
        this.token = space.getToken();
        if (space.getUsers() != null) {
            this.users = space.getUsers().stream().map(SimpleMemberResponse::new).collect(Collectors.toList());
        }
        if (space.getHolidays() != null) {
            this.holidays = space.getHolidays().stream().map(HolidayResponse::new).collect(Collectors.toList());
        }

        if (space.getMessageChannels() != null) {
            this.messageChannels = space.getMessageChannels().stream().map(SpaceMessageChannelResponse::new).collect(Collectors.toList());
        }

        if (space.getLlms() != null) {
            this.llms = space.getLlms().stream().map(LlmResponse::new).collect(Collectors.toList());
        }

        if (space.getLlmPrompts() != null) {
            this.llmPrompts = space.getLlmPrompts().stream().map(SpaceLlmPromptResponse::new).collect(Collectors.toList());
        }
    }

    public SpaceResponse(SpaceDTO space, List<ProjectListDTO> projects) {
        this(space);
        this.applicants = space.getApplicants().stream().map(SpaceApplicantResponse::new).collect(Collectors.toList());
        this.projects = projects.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }

    public SpaceResponse(SpaceDTO space, Long userId, List<ProjectListDTO> projects) {
        this(space);
        if (userId != null && space.getUsers().stream().anyMatch(spaceUser -> spaceUser.getUser().getId().equals(userId) && UserRoleCode.ADMIN.equals(spaceUser.getRole()))) {
            this.isAdmin = true;
            this.applicants = space.getApplicants().stream().map(SpaceApplicantResponse::new).collect(Collectors.toList());
        }

        this.projects = projects.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }


}
