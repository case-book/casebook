package com.mindplates.bugcase.biz.user.vo.response;

import com.mindplates.bugcase.common.entity.UserRole;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SimpleSpaceUserResponse {

  private Long id;
  private Long userId;
  private UserRole role;
  private String email;
  private String name;
}
