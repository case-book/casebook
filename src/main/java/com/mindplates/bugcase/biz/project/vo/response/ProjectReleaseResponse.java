package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseSimpleResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class ProjectReleaseResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectResponse project;
    private List<TestcaseSimpleResponse> testcases;
    private LocalDateTime creationDate;

    public ProjectReleaseResponse(ProjectReleaseDTO projectReleaseDTO, long userId) {
        this.id = projectReleaseDTO.getId();
        this.name = projectReleaseDTO.getName();
        this.description = projectReleaseDTO.getDescription();
        this.project = new ProjectResponse(projectReleaseDTO.getProject(), userId);
        this.creationDate = projectReleaseDTO.getCreationDate();
        this.testcases = projectReleaseDTO.getTestcases().stream().map(TestcaseSimpleResponse::new).collect(Collectors.toList());
    }
}
