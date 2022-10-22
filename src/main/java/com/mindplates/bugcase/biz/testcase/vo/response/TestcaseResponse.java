package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestcaseResponse {

  private Long id;
  private String seqId;

  private Long projectId;
  private Long testcaseGroupId;
  private Long testcaseTemplateId;
  private String name;
  private Integer itemOrder;
  private Boolean closed;
  private List<TestcaseItemResponse> testcaseItems;

  public TestcaseResponse(Testcase testcase) {
    this.id = testcase.getId();
    this.projectId = testcase.getProject().getId();
    this.seqId = testcase.getSeqId();
    this.testcaseGroupId = testcase.getTestcaseGroup().getId();
    this.testcaseTemplateId = testcase.getTestcaseTemplate().getId();
    this.name = testcase.getName();
    this.itemOrder = testcase.getItemOrder();
    this.closed = testcase.getClosed();
    this.testcaseItems = testcase.getTestcaseItems().stream().map(TestcaseItemResponse::new).collect(Collectors.toList());
  }

}
