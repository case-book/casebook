package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.user.vo.response.SimpleMemberResponse;
import com.mindplates.bugcase.common.code.UserRole;
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
  private List<ProjectListResponse> projects;
  private Long projectCount;
  private boolean allowSearch = false;
  private boolean allowAutoJoin = false;
  private boolean isAdmin = false;

  public SpaceResponse(Space space) {
    this.id = space.getId();
    this.name = space.getName();
    this.code = space.getCode();
    this.activated = space.isActivated();
    this.description = space.getDescription();
    this.activated = space.isActivated();
    this.allowSearch = space.isAllowSearch();
    this.allowAutoJoin = space.isAllowAutoJoin();
    this.token = space.getToken();
    if (space.getUsers() != null) {
      this.users = space.getUsers().stream().map(
          (spaceUser) -> SimpleMemberResponse.builder()
              .id(spaceUser.getId())
              .userId(spaceUser.getUser().getId())
              .role(spaceUser.getRole())
              .email(spaceUser.getUser().getEmail())
              .name(spaceUser.getUser().getName())
              .build()).collect(Collectors.toList());
    }


  }

  public SpaceResponse(Space space, Long projectCount) {
    this(space);
    this.projectCount = projectCount;



  }

  public SpaceResponse(Space space, Long userId, List<Project> projects) {
    this(space);
    if (userId != null && space.getUsers().stream().anyMatch(spaceUser -> spaceUser.getUser().getId().equals(userId) && UserRole.ADMIN.equals(spaceUser.getRole()))) {
      this.isAdmin = true;
      this.applicants = space.getApplicants().stream().map(SpaceApplicantResponse::new).collect(Collectors.toList());
    }

    this.projects = projects.stream().map(ProjectListResponse::new).collect(Collectors.toList());
  }


}
