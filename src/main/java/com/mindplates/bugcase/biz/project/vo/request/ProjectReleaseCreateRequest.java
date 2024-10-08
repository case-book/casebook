package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseListDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class ProjectReleaseCreateRequest {

    private String name;
    private String description;
    private List<Long> testcaseIds;
    private Boolean isTarget;

    public ProjectReleaseDTO toDTO(long projectId) {
        return ProjectReleaseDTO.builder()
            .name(name)
            .description(description)
            .project(ProjectDTO.builder().id(projectId).build())
            .isTarget(isTarget)
            .testcases(testcaseIds.stream().map(id -> TestcaseListDTO.builder().id(id).build()).collect(Collectors.toList()))
            .build();
    }
}
