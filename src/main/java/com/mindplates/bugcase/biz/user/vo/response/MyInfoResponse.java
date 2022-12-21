package com.mindplates.bugcase.biz.user.vo.response;


import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.vo.response.SimpleSpaceResponse;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.SystemRole;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MyInfoResponse {

  private Long id;
  private String uuid;
  private SystemRole systemRole;
  private String token;
  private String email;
  private String name;

  private List<SimpleSpaceResponse> spaces;

  public MyInfoResponse(User user, String token) {
    if (user != null) {
      this.id = user.getId();
      this.uuid = user.getUuid();
      this.email = user.getEmail();
      this.name = user.getName();
      this.systemRole = user.getSystemRole();
    }

    this.token = token;
  }

  public MyInfoResponse(User user, List<Space> spaces, String token) {
    this(user, token);
    if (spaces != null) {
      this.spaces = spaces.stream().map(SimpleSpaceResponse::new).collect(Collectors.toList());
    }


  }
}
