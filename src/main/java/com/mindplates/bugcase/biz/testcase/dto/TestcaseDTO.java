package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseDTO extends CommonDTO {

  private Long id;
  private String seqId;
  private TestcaseGroupDTO testcaseGroup;
  private String name;
  private String description;
  private Integer itemOrder;
  private Boolean closed;
  private TestcaseTemplateDTO testcaseTemplate;
  private List<TestcaseItemDTO> testcaseItems;
  private ProjectDTO project;
  private String testerType;
  private String testerValue;


}
