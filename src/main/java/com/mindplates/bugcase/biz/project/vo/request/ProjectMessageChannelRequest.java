package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class ProjectMessageChannelRequest implements IRequestVO<ProjectMessageChannelDTO> {

    private Long id;
    private Long spaceMessageChannelId;

    @Override
    public ProjectMessageChannelDTO toDTO() {
        return ProjectMessageChannelDTO.builder()
            .id(id)
            .messageChannel(SpaceMessageChannelDTO.builder().id(spaceMessageChannelId).build())
            .build();
    }

    public ProjectMessageChannelDTO toDTO(ProjectDTO project) {
        ProjectMessageChannelDTO dto = toDTO();
        dto.setProject(project);
        return dto;

    }


}
