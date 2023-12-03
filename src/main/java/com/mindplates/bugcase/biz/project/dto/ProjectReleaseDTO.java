package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseSimpleDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ProjectReleaseDTO extends CommonDTO {

    private Long id;
    private String name;
    private Boolean isTarget;
    private String description;
    private ProjectDTO project;
    private List<TestcaseSimpleDTO> testcases;
    private LocalDateTime creationDate;

    public ProjectReleaseDTO(ProjectRelease projectRelease) {
        this.id = projectRelease.getId();
        this.name = projectRelease.getName();
        this.creationDate = projectRelease.getCreationDate();
        this.description = projectRelease.getDescription();
        this.isTarget = projectRelease.getIsTarget();
        if (projectRelease.getProject() != null) {
            this.project = ProjectDTO.builder().id(projectRelease.getProject().getId()).build();
        }

        if (projectRelease.getTestcaseProjectReleases() != null) {
            this.testcases = projectRelease.getTestcaseProjectReleases()
                .stream()
                .map(testcaseProjectRelease -> new TestcaseSimpleDTO(testcaseProjectRelease.getTestcase()))
                .distinct()
                .collect(Collectors.toList());
        }
    }
}
