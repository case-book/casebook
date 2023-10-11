package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

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
    private List<TestcaseTemplateDTO> testcaseTemplates;
    private List<ProjectUserDTO> users;
    private List<ProjectApplicantDTO> applicants;
    private SpaceDTO space;
    private List<ProjectReleaseDTO> projectReleases;
    private Integer testcaseGroupSeq = 0;
    private Integer testcaseSeq = 0;
    private Integer testrunSeq = 0;
    private Long testrunCount = 0L;
    private Long testcaseCount = 0L;
    private String slackUrl;
    private boolean enableTestrunAlarm;

    public ProjectDTO(Project project, boolean detail) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.token = project.getToken();
        this.creationDate = project.getCreationDate();
        if (detail && project.getSpace() != null) {
            this.space = SpaceDTO.builder().id(project.getSpace().getId()).build();
        }
        this.testcaseGroupSeq = project.getTestcaseGroupSeq();
        this.testcaseSeq = project.getTestcaseSeq();
        this.testrunSeq = project.getTestrunSeq();
        this.slackUrl = project.getSlackUrl();
        this.enableTestrunAlarm = project.isEnableTestrunAlarm();
        if (project.getProjectReleases() != null) {
            this.projectReleases = project.getProjectReleases().stream().map(ProjectReleaseDTO::new).collect(Collectors.toList());
        }
        if (detail && project.getUsers() != null) {
            this.users = project.getUsers().stream().map(ProjectUserDTO::new).collect(Collectors.toList());
        }

        if (detail && project.getTestcaseTemplates() != null) {
            this.testcaseTemplates = project.getTestcaseTemplates().stream().map(TestcaseTemplateDTO::new).collect(Collectors.toList());
        }

        if (detail && project.getTestcaseGroups() != null) {
            this.testcaseGroups = project.getTestcaseGroups().stream().map(TestcaseGroupDTO::new).collect(Collectors.toList());
        }

        if (detail && project.getApplicants() != null) {
            this.applicants = project.getApplicants().stream().map(ProjectApplicantDTO::new).collect(Collectors.toList());
        }

    }

    public ProjectDTO(Project project, Long testrunCount, Long testcaseCount) {
        this(project, false);
        this.testrunCount = testrunCount;
        this.testcaseCount = testcaseCount;
    }

}
