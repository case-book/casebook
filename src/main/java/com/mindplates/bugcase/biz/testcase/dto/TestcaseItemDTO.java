package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseItemDTO extends CommonDTO {

  private Long id;
  private TestcaseTemplateItemDTO testcaseTemplateItem;
  private TestcaseDTO testcase;
  private String type;
  private String value;
  private String text;

}
