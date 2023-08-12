package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class ProjectReleaseCreateRequest {

    private String name;
    private String description;
    private List<Long> testcaseIds;

    public ProjectReleaseDTO toDTO(long projectId) {
        return ProjectReleaseDTO.builder()
            .name(name)
            .description(description)
            .project(ProjectDTO.builder().id(projectId).build())
            .testcases(testcaseIds.stream().map(id -> TestcaseDTO.builder().id(id).build()).collect(Collectors.toList()))
            .build();
    }
}
