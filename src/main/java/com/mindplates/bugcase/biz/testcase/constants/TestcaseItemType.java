package com.mindplates.bugcase.biz.testcase.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestcaseItemType {
  CHECKBOX("CHECKBOX"),
  RADIO("RADIO"),
  TEXT("TEXT"),
  NUMBER("NUMBER"),
  USER("USER"),
  SELECT("SELECT"),
  URL("URL"),
  EDITOR("EDITOR"),
  ;
  private String type;

}
