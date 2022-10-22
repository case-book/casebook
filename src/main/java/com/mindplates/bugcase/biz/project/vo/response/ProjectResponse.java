package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateResponse;
import java.time.LocalDateTime;
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
public class ProjectResponse {

  private Long id;
  private String name;
  private String description;
  private String token;
  private Boolean activated;
  private LocalDateTime creationDate;
  private String spaceName;
  private List<TestcaseTemplateResponse> testcaseTemplates;

  private List<TestcaseGroupResponse> testcaseGroups;

  public ProjectResponse(Project project) {
    this.id = project.getId();
    this.name = project.getName();
    this.description = project.getDescription();
    this.token = project.getToken();
    this.activated = project.isActivated();
    this.creationDate = project.getCreationDate();
    this.spaceName = project.getSpace().getName();
    if (project.getTestcaseTemplates() != null && project.getTestcaseTemplates().size() > 0) {
      this.testcaseTemplates = project.getTestcaseTemplates().stream().map(TestcaseTemplateResponse::new).collect(Collectors.toList());
    }

    if (project.getTestcaseGroups() != null && project.getTestcaseGroups().size() > 0) {
      this.testcaseGroups = project.getTestcaseGroups().stream().map(TestcaseGroupResponse::new).collect(Collectors.toList());
    }
  }
}
