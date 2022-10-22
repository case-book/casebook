package com.mindplates.bugcase.biz.testcase.vo.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
public class TestcaseTemplateDataResponse {

  List<String> testcaseItemTypes;

  List<String> testcaseItemCategories;

  public TestcaseTemplateDataResponse(List<String> testcaseItemTypes, List<String> testcaseItemCategories) {
    this.testcaseItemTypes = testcaseItemTypes;
    this.testcaseItemCategories = testcaseItemCategories;
  }
}
