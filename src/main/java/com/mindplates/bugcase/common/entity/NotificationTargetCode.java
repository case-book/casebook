package com.mindplates.bugcase.common.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum NotificationTargetCode {

  USER("USER"),
  SPACE("SPACE"),
  PROJECT("PROJECT");
  private String code;

}
