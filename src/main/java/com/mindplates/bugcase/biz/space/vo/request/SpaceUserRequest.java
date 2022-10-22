package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.common.entity.UserRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpaceUserRequest {

  private Long id;
  private String CRUD;
  private Long userId;
  private UserRole role;
}
