package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class ProjectDTO extends CommonDTO implements IDTO<Project> {

    private Long id;
    private String name;
    private String description;
    private boolean activated;
    private String token;
    @Builder.Default
    private Integer testcaseGroupSeq = 0;
    @Builder.Default
    private Integer testcaseSeq = 0;
    @Builder.Default
    private Integer testrunSeq = 0;
    @Builder.Default
    private Long testrunCount = 0L;
    @Builder.Default
    private Long testcaseCount = 0L;
    private boolean aiEnabled;
    private SpaceDTO space;
    private List<TestcaseTemplateDTO> testcaseTemplates;
    private List<ProjectUserDTO> users;
    private List<ProjectMessageChannelDTO> messageChannels;


    public ProjectDTO(Project project) {
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
        this.testrunCount = project.getTestrunCount();
        this.testcaseCount = project.getTestcaseCount();

        if (project.getSpace() != null) {
            this.space = SpaceDTO.builder().id(project.getSpace().getId()).build();
        }

        if (project.getTestcaseTemplates() != null) {
            this.testcaseTemplates = project.getTestcaseTemplates().stream().map(TestcaseTemplateDTO::new).collect(Collectors.toList());
        }

        if (project.getUsers() != null) {
            this.users = project.getUsers().stream().map(ProjectUserDTO::new).collect(Collectors.toList());
        }

        if (project.getMessageChannels() != null) {
            this.messageChannels = project.getMessageChannels().stream().map(ProjectMessageChannelDTO::new).collect(Collectors.toList());
        }

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

    public void updateInfo(ProjectDTO updateProjectInfo) {
        setName(updateProjectInfo.getName());
        setDescription(updateProjectInfo.getDescription());
        setToken(updateProjectInfo.getToken());
        setActivated(updateProjectInfo.isActivated());
        setAiEnabled(updateProjectInfo.isAiEnabled());
        if (updateProjectInfo.getTestcaseGroupSeq() != null) {
            setTestcaseGroupSeq(updateProjectInfo.getTestcaseGroupSeq());
        }

        if (updateProjectInfo.getTestrunSeq() != null) {
            setTestrunSeq(updateProjectInfo.getTestrunSeq());
        }

        if (updateProjectInfo.getTestcaseSeq() != null) {
            setTestcaseSeq(updateProjectInfo.getTestcaseSeq());
        }
    }

    public List<Long> updateTestcaseTemplates(List<TestcaseTemplateDTO> updateTestcaseTemplates) {
        List<Long> deleteTestcaseTemplateIds = new ArrayList<>();

        if (updateTestcaseTemplates != null) {
            for (TestcaseTemplateDTO updateTestcaseTemplate : updateTestcaseTemplates) {
                // ID가 없으면 추가
                if (updateTestcaseTemplate.getId() == null) {
                    this.testcaseTemplates.add(updateTestcaseTemplate);
                } else if ("D".equals(updateTestcaseTemplate.getCrud())) {
                    deleteTestcaseTemplateIds.add(updateTestcaseTemplate.getId());
                    this.testcaseTemplates.removeIf(testcaseTemplateDTO -> testcaseTemplateDTO.getId().equals(updateTestcaseTemplate.getId()));
                }
            }

            // updateTestcaseTemplates 업데이트 대상을 id, 객체 맵으로 변환
            HashMap<Long, TestcaseTemplateDTO> updateTestcaseTemplateMap = new HashMap<>();
            for (TestcaseTemplateDTO updateTestcaseTemplate : updateTestcaseTemplates) {
                if (updateTestcaseTemplate.getId() != null && !"D".equals(updateTestcaseTemplate.getCrud())) {
                    updateTestcaseTemplateMap.put(updateTestcaseTemplate.getId(), updateTestcaseTemplate);
                }
            }

            for (TestcaseTemplateDTO testcaseTemplate : this.testcaseTemplates) {
                if (testcaseTemplate.getId() != null && updateTestcaseTemplateMap.containsKey(testcaseTemplate.getId())) {
                    testcaseTemplate.updateInfo(updateTestcaseTemplateMap.get(testcaseTemplate.getId()));
                }
            }
        }

        if (this.testcaseTemplates.isEmpty()) {
            throw new ServiceException("error.project.testcase.template.required");
        }

        // this.testcaseTemplates를 반복하면서, defaultTemplate이 true인 것이 1개 이상인지 확인
        boolean found = false;
        for (TestcaseTemplateDTO testcaseTemplate : this.testcaseTemplates) {
            if (!found && testcaseTemplate.isDefaultTemplate()) {
                found = true;
            } else if (found && testcaseTemplate.isDefaultTemplate()) {
                testcaseTemplate.setDefaultTemplate(false);
            }
        }

        if (!found) {
            this.testcaseTemplates.get(0).setDefaultTemplate(true);
        }

        return deleteTestcaseTemplateIds;
    }

    public void updateUsers(List<ProjectUserDTO> updateUsers) {

        // updateUsers의 ID가 있고, updateUsers의 CRUD가 D가 아닌 경우, 업데이트
        updateUsers.stream().filter(updateProjectUser -> updateProjectUser.getId() != null && !"D".equals(updateProjectUser.getCrud())).forEach(updateProjectUser -> {
            for (ProjectUserDTO projectUser : this.users) {
                if (projectUser.getId() != null && projectUser.getId().equals(updateProjectUser.getId())) {
                    projectUser.updateInfo(updateProjectUser);
                }
            }
        });

        // updateUsers의 CRUD가 D인 경우, 해당 ID를 가진 사용자를 this.users에서 제거
        this.users.removeIf(projectUser -> updateUsers.stream().anyMatch(updateProjectUser -> projectUser.getId().equals(updateProjectUser.getId()) && "D".equals(updateProjectUser.getCrud())));

        // updateUsers의 ID가 없는 경우, this.users에 추가
        updateUsers.stream().filter(updateProjectUser -> updateProjectUser.getId() == null).forEach(updateProjectUser -> this.users.add(updateProjectUser));

        // updateUsers에 role이 ADMIN인 사용자가 1명 없는 경우 ServiceException 발생
        if (this.users.stream().noneMatch(projectUser -> projectUser.getRole().equals(UserRoleCode.ADMIN))) {
            throw new ServiceException("error.project.user.admin.required");
        }


    }

    public List<Long> updateMessageChannels(List<ProjectMessageChannelDTO> updateMessageChannels) {
        List<Long> deleteMessageChannelIds = this.messageChannels.stream()
            .map(ProjectMessageChannelDTO::getId)
            .filter((projectMessageChannelId -> updateMessageChannels.stream().noneMatch((updateMessageChannel -> projectMessageChannelId.equals(updateMessageChannel.getId())))))
            .collect(Collectors.toList());

        this.messageChannels.removeIf((projectMessageChannel -> deleteMessageChannelIds.contains(projectMessageChannel.getId())));

        for (ProjectMessageChannelDTO updateMessageChannel : updateMessageChannels) {
            if (updateMessageChannel.getId() == null) {
                this.messageChannels.add(updateMessageChannel);
            } else {
                // 같은 ID를 가진 객체 검색 후 변경
                ProjectMessageChannelDTO projectMessageChannel = this.messageChannels.stream()
                    .filter((messageChannel -> messageChannel.getId().equals(updateMessageChannel.getId())))
                    .findFirst()
                    .orElseThrow(() -> new ServiceException("error.project.message.channel.not.found"));

                projectMessageChannel.setMessageChannel(updateMessageChannel.getMessageChannel());
            }
        }

        return deleteMessageChannelIds;

    }
}
