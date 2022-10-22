package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseTemplateResponse {

  private Long id;
  private String name;
  private Boolean isDefault;
  private List<TestcaseTemplateItemResponse> testcaseTemplateItems;

  public TestcaseTemplateResponse(TestcaseTemplate testcaseTemplate) {
    this.id = testcaseTemplate.getId();
    this.name = testcaseTemplate.getName();
    this.isDefault = testcaseTemplate.getIsDefault();
    this.testcaseTemplateItems = testcaseTemplate.getTestcaseTemplateItems().stream().map(TestcaseTemplateItemResponse::new).collect(Collectors.toList());
  }
}
