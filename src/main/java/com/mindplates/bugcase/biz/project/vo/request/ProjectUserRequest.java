package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.common.code.UserRoleCode;
import lombok.Data;

@Data
public class ProjectUserRequest {

  private Long id;
  private String crud;
  private Long userId;
  private UserRoleCode role;
}
