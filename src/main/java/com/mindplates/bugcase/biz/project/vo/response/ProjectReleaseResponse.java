package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseResponse;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ProjectReleaseResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectResponse project;
    private List<TestcaseResponse> testcases;

    public ProjectReleaseResponse(ProjectReleaseDTO projectReleaseDTO, long userId) {
        this.id = projectReleaseDTO.getId();
        this.name = projectReleaseDTO.getName();
        this.description = projectReleaseDTO.getDescription();
        this.project = new ProjectResponse(projectReleaseDTO.getProject(), userId);
        this.testcases = projectReleaseDTO.getTestcases().stream().map(TestcaseResponse::new).collect(Collectors.toList());
    }
}
