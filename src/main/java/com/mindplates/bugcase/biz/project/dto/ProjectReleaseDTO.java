package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseListDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
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
public class ProjectReleaseDTO extends CommonDTO implements IDTO<ProjectRelease> {

    private Long id;
    private String name;
    private Boolean isTarget;
    private String description;
    private ProjectDTO project;
    private List<TestcaseListDTO> testcases;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public ProjectReleaseDTO(ProjectRelease projectRelease) {
        this.id = projectRelease.getId();
        this.name = projectRelease.getName();
        this.creationDate = projectRelease.getCreationDate();
        this.lastUpdateDate = projectRelease.getLastUpdateDate();
        this.description = projectRelease.getDescription();
        this.isTarget = projectRelease.getIsTarget();
        if (projectRelease.getProject() != null) {
            this.project = ProjectDTO.builder().id(projectRelease.getProject().getId()).build();
        }

        if (projectRelease.getTestcaseProjectReleases() != null) {
            this.testcases = projectRelease.getTestcaseProjectReleases()
                .stream()
                .map(testcaseProjectRelease -> new TestcaseListDTO(testcaseProjectRelease.getTestcase()))
                .distinct()
                .collect(Collectors.toList());
        }
    }

    @Override
    public ProjectRelease toEntity() {
        ProjectRelease projectRelease = ProjectRelease.builder()
            .id(this.id)
            .name(this.name)
            .description(this.description)
            .isTarget(this.isTarget)
            .project(Project.builder().id(this.project.getId()).build())
            .build();

        if (this.testcases != null) {
            projectRelease.setTestcaseProjectReleases(this.testcases.stream().map(testcaseSimpleDTO -> {
                TestcaseProjectRelease testcaseProjectRelease = new TestcaseProjectRelease();
                testcaseProjectRelease.setTestcase(Testcase.builder().id(testcaseSimpleDTO.getId()).build());
                testcaseProjectRelease.setProjectRelease(projectRelease);
                return testcaseProjectRelease;

            }).collect(Collectors.toList()));
        }

        projectRelease.setCreationDate(this.creationDate);

        return projectRelease;
    }

    public ProjectRelease toEntity(Project project) {
        ProjectRelease projectRelease = this.toEntity();
        projectRelease.setProject(project);
        return projectRelease;
    }


}
