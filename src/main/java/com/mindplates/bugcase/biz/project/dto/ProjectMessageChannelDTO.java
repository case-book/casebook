package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectMessageChannel;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
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
public class ProjectMessageChannelDTO extends CommonDTO implements IDTO<ProjectMessageChannel> {

    private Long id;
    private ProjectDTO project;
    private SpaceMessageChannelDTO messageChannel;

    public ProjectMessageChannelDTO(ProjectMessageChannel projectMessageChannel) {
        this.id = projectMessageChannel.getId();
        if (projectMessageChannel.getProject() != null) {
            this.project = ProjectDTO.builder().id(projectMessageChannel.getProject().getId()).build();
        }
        if (projectMessageChannel.getMessageChannel() != null) {
            this.messageChannel = new SpaceMessageChannelDTO(projectMessageChannel.getMessageChannel());
        }

    }


    @Override
    public ProjectMessageChannel toEntity() {
        return ProjectMessageChannel.builder()
            .id(this.id)
            .project(Project.builder().id(this.project.getId()).build())
            .messageChannel(SpaceMessageChannel.builder().id(messageChannel.getId()).build())
            .build();
    }

    public ProjectMessageChannel toEntity(Project project) {
        ProjectMessageChannel projectMessageChannel = this.toEntity();
        projectMessageChannel.setProject(project);
        return projectMessageChannel;

    }
}
