package com.mindplates.bugcase.biz.testcase.vo.request;

import lombok.Data;

@Data
public class TestcaseGroupOrderChangeRequest {

  private Long targetId;
  private Long destinationId;
  private boolean toChildren;


}
