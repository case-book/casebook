package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
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
    private Integer testcaseGroupSeq = 0;
    private Integer testcaseSeq = 0;
    private Integer testrunSeq = 0;
    private Long testrunCount = 0L;
    private String slackUrl;
    private boolean enableTestrunAlarm;

    public ProjectDTO(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.token = project.getToken();
        this.creationDate = project.getCreationDate();
        this.space = SpaceDTO.builder().id(project.getSpace().getId()).name(project.getSpace().getName()).build();
        this.testcaseGroupSeq = project.getTestcaseGroupSeq();
        this.testcaseSeq = project.getTestcaseSeq();
        this.testrunSeq = project.getTestrunSeq();
        this.slackUrl = project.getSlackUrl();
        this.enableTestrunAlarm = project.isEnableTestrunAlarm();
        this.users = project.getUsers().stream().map(ProjectUserDTO::new).collect(Collectors.toList());
        if (project.getTestcaseTemplates() != null) {
            this.testcaseTemplates = project.getTestcaseTemplates().stream().map(TestcaseTemplateDTO::new).collect(Collectors.toList());
        }

        if (project.getTestcaseGroups() != null) {
            this.testcaseGroups = project.getTestcaseGroups().stream().map(TestcaseGroupDTO::new).collect(Collectors.toList());
        }

        if (project.getApplicants() != null) {
            this.applicants = project.getApplicants().stream().map(ProjectApplicantDTO::new).collect(Collectors.toList());
        }

    }

    public ProjectDTO(Project project, Long testrunCount) {
        this(project);
        this.testrunCount = testrunCount;
    }

}
