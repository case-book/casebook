package com.mindplates.bugcase.biz.user.vo.response;

import com.mindplates.bugcase.common.code.UserRole;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SimpleMemberResponse {

  private Long id;
  private Long userId;
  private UserRole role;
  private String email;
  private String name;
}
