package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.entity.Space;
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
public class SimpleSpaceResponse {

  private Long id;
  private String name;
  private String code;
  private Boolean activated;
  private Boolean allowSearch;
  private Boolean allowAutoJoin;

  private Boolean isMember;

  public SimpleSpaceResponse(Space space) {
    this(space, null);
  }

  public SimpleSpaceResponse(Space space, Long userId) {
    this.id = space.getId();
    this.name = space.getName();
    this.code = space.getCode();
    this.activated = space.isActivated();
    this.allowSearch = space.isAllowSearch();
    this.allowAutoJoin = space.isAllowAutoJoin();
    this.isMember = space.getUsers().stream().anyMatch((spaceUser -> spaceUser.getUser().getId().equals(userId)));
  }


}
