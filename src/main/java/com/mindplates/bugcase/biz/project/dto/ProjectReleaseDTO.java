package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseSimpleDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProjectReleaseDTO extends CommonDTO {

    private Long id;
    private String name;
    private String description;
    private ProjectDTO project;
    private List<TestcaseSimpleDTO> testcases;

    public ProjectReleaseDTO(ProjectRelease projectRelease) {
        this.id = projectRelease.getId();
        this.name = projectRelease.getName();
        this.description = projectRelease.getDescription();
        this.project = new ProjectDTO(projectRelease.getProject(), false);
        this.testcases = projectRelease.getTestcases().stream().map(TestcaseSimpleDTO::new).collect(Collectors.toList());
    }
}
