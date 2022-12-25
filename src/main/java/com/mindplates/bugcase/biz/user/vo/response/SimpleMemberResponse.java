package com.mindplates.bugcase.biz.user.vo.response;

import com.mindplates.bugcase.common.code.UserRoleCode;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SimpleMemberResponse {

  private Long id;
  private Long userId;
  private UserRoleCode role;
  private String email;
  private String name;
}
