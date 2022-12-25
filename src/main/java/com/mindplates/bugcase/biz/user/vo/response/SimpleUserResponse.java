package com.mindplates.bugcase.biz.user.vo.response;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleUserResponse {

  private Long id;
  private String email;
  private String name;

  public SimpleUserResponse(User user) {
    this.id = user.getId();
    this.email = user.getEmail();
    this.name = user.getName();
  }

  public SimpleUserResponse(UserDTO user) {
    this.id = user.getId();
    this.email = user.getEmail();
    this.name = user.getName();
  }
}
