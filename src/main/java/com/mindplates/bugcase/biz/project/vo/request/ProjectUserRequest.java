package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.common.entity.UserRole;
import lombok.Data;

@Data
public class ProjectUserRequest {

  private Long id;
  private String crud;
  private Long userId;
  private UserRole role;
}
