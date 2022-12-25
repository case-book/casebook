package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.common.code.UserRoleCode;
import lombok.Data;

@Data
public class SpaceUserRequest {

  private Long id;
  private String crud;
  private Long userId;
  private UserRoleCode role;
}
