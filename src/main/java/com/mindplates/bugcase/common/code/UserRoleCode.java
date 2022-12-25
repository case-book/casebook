package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum UserRoleCode {

  ADMIN("ADMIN"),
  USER("USER");
  private String code;

}
