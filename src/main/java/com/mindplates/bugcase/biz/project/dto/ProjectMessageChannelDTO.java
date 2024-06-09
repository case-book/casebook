package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.ProjectMessageChannel;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectMessageChannelDTO extends CommonDTO {

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


}
