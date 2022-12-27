package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunDTO extends CommonDTO {

  private Long id;
  private String seqId;
  private String name;
  private String description;
  private List<TestrunUserDTO> testrunUsers;
  private List<TestrunTestcaseGroupDTO> testcaseGroups;
  private Project project;
  private LocalDateTime startDateTime;
  private LocalDateTime endDateTime;
  private boolean opened;
  private int totalTestcaseCount;
  private int passedTestcaseCount;
  private int failedTestcaseCount;
  private LocalDateTime closedDate;

}
