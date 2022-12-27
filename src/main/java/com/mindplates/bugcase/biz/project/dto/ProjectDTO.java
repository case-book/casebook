package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectDTO extends CommonDTO {

  private Long id;
  private String name;
  private String description;
  private boolean activated;
  private String token;
  private List<TestcaseGroupDTO> testcaseGroups;
  private List<TestrunDTO> testruns;
  private List<TestcaseTemplateDTO> testcaseTemplates;
  private List<ProjectUserDTO> users;
  private List<ProjectApplicantDTO> applicants;
  private SpaceDTO space;
  private Integer testcaseGroupSeq = 0;
  private Integer testcaseSeq = 0;
  private Integer testrunSeq = 0;

}
