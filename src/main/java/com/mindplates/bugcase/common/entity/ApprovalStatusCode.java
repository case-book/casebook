package com.mindplates.bugcase.common.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum ApprovalStatusCode {

  REQUEST("REQUEST"),
  APPROVAL("APPROVAL"),
  REJECTED("REJECTED");
  private String code;

}
