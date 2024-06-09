package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMessageChannelResponse {

    private Long id;
    private Long projectId;
    private Long spaceMessageChannelId;
    private String name;
    private String url;
    private MessageChannelTypeCode messageChannelType;


    public ProjectMessageChannelResponse(ProjectMessageChannelDTO projectMessageChannel) {
        this.id = projectMessageChannel.getId();
        this.projectId = projectMessageChannel.getProject().getId();
        this.spaceMessageChannelId = projectMessageChannel.getMessageChannel().getId();
        this.name = projectMessageChannel.getMessageChannel().getName();
        this.url = projectMessageChannel.getMessageChannel().getUrl();
        this.messageChannelType = projectMessageChannel.getMessageChannel().getMessageChannelType();
    }
}
