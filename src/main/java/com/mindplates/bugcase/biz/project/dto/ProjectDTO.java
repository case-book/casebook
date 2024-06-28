package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectDTO extends CommonDTO implements IDTO<Project> {

    private Long id;
    private String name;
    private String description;
    private boolean activated;
    private String token;
    private Integer testcaseGroupSeq = 0;
    private Integer testcaseSeq = 0;
    private Integer testrunSeq = 0;
    private Long testrunCount = 0L;
    private Long testcaseCount = 0L;
    private boolean aiEnabled;
    private SpaceDTO space;
    private List<TestcaseGroupDTO> testcaseGroups; // 삭제하고, 관련된 코드 변경 필요함
    private List<TestcaseTemplateDTO> testcaseTemplates;
    private List<ProjectUserDTO> users;
    private List<ProjectApplicantDTO> applicants;
    private List<ProjectReleaseDTO> projectReleases;
    private List<ProjectMessageChannelDTO> messageChannels;


    public ProjectDTO(Project project, boolean detail) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.token = project.getToken();
        this.creationDate = project.getCreationDate();
        this.testcaseGroupSeq = project.getTestcaseGroupSeq();
        this.testcaseSeq = project.getTestcaseSeq();
        this.testrunSeq = project.getTestrunSeq();
        this.aiEnabled = project.isAiEnabled();

        if (detail && project.getSpace() != null) {
            this.space = SpaceDTO.builder().id(project.getSpace().getId()).build();
        }

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

        if (detail && project.getMessageChannels() != null) {
            this.messageChannels = project.getMessageChannels().stream().map(ProjectMessageChannelDTO::new).collect(Collectors.toList());
        }

    }

    public ProjectDTO(Project project, Long testrunCount, Long testcaseCount) {
        this(project, false);
        this.testrunCount = testrunCount;
        this.testcaseCount = testcaseCount;
    }

    @Override
    public Project toEntity() {
        Project project = Project.builder()
            .id(this.id)
            .name(this.name)
            .description(this.description)
            .activated(this.activated)
            .token(this.token)
            .testcaseGroupSeq(this.testcaseGroupSeq)
            .testcaseSeq(this.testcaseSeq)
            .testrunSeq(this.testrunSeq)
            .aiEnabled(this.aiEnabled)
            .build();

        if (this.space != null) {
            project.setSpace(Space.builder().id(space.getId()).build());
        }

        if (this.testcaseGroups != null) {
            project.setTestcaseGroups(this.testcaseGroups.stream().map(testcaseGroupDTO -> testcaseGroupDTO.toEntity(project)).collect(Collectors.toList()));
        } else {
            project.setTestcaseGroups(Collections.emptyList());
        }

        if (this.testcaseTemplates != null) {
            project.setTestcaseTemplates(this.testcaseTemplates.stream().map(testcaseTemplateDTO -> testcaseTemplateDTO.toEntity(project)).collect(Collectors.toList()));
        } else {
            project.setTestcaseTemplates(Collections.emptyList());
        }

        if (this.users != null) {
            project.setUsers(this.users.stream().map(projectUserDTO -> projectUserDTO.toEntity(project)).collect(Collectors.toList()));
        } else {
            project.setUsers(Collections.emptyList());
        }

        if (this.applicants != null) {
            project.setApplicants(this.applicants.stream().map(projectApplicantDTO -> projectApplicantDTO.toEntity(project)).collect(Collectors.toList()));
        } else {
            project.setApplicants(Collections.emptyList());
        }

        if (this.projectReleases != null) {
            project.setProjectReleases(this.projectReleases.stream().map(projectReleaseDTO -> projectReleaseDTO.toEntity(project)).collect(Collectors.toList()));
        } else {
            project.setProjectReleases(Collections.emptyList());
        }

        if (this.messageChannels != null) {
            project.setMessageChannels(this.messageChannels.stream().map(projectMessageChannelDTO -> projectMessageChannelDTO.toEntity(project)).collect(Collectors.toList()));
        } else {
            project.setMessageChannels(Collections.emptyList());
        }

        return project;
    }


    public Project toEntity(Space space) {
        Project project = toEntity();

        if (this.space != null) {
            project.setSpace(space);
        }

        return project;
    }
}
