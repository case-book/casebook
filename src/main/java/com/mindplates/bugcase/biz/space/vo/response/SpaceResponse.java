package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.user.vo.response.SimpleMemberResponse;
import com.mindplates.bugcase.common.code.UserRoleCode;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

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
    private List<ProjectListResponse> projects;
    private List<HolidayResponse> holidays;

    private Long projectCount;
    private boolean allowSearch = false;
    private boolean allowAutoJoin = false;
    private boolean isAdmin = false;

    public SpaceResponse(SpaceDTO space) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.isActivated();
        this.description = space.getDescription();
        this.allowSearch = space.isAllowSearch();
        this.allowAutoJoin = space.isAllowAutoJoin();
        this.token = space.getToken();
        if (space.getUsers() != null) {
            this.users = space.getUsers().stream().map(SimpleMemberResponse::new).collect(Collectors.toList());
        }
        if (space.getHolidays() != null) {
            this.holidays = space.getHolidays().stream().map(HolidayResponse::new).collect(Collectors.toList());
        }
    }

    public SpaceResponse(SpaceDTO space, List<ProjectDTO> projects) {
        this(space);
        this.applicants = space.getApplicants().stream().map(SpaceApplicantResponse::new).collect(Collectors.toList());
        this.projects = projects.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }

    public SpaceResponse(SpaceDTO space, Long userId, List<ProjectDTO> projects) {
        this(space);
        if (userId != null && space.getUsers().stream().anyMatch(spaceUser -> spaceUser.getUser().getId().equals(userId) && UserRoleCode.ADMIN.equals(spaceUser.getRole()))) {
            this.isAdmin = true;
            this.applicants = space.getApplicants().stream().map(SpaceApplicantResponse::new).collect(Collectors.toList());
        }

        this.projects = projects.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }


}
