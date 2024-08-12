package com.mindplates.bugcase.biz.links.vo.response;

import com.mindplates.bugcase.biz.links.dto.OpenLinkDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OpenLinkResponse {

    private Long id;
    private String name;
    private String token;
    private ProjectResponse project;
    private LocalDateTime openEndDateTime;
    private boolean opened;

    public OpenLinkResponse(OpenLinkDTO openLink) {
        this.id = openLink.getId();
        this.name = openLink.getName();
        this.token = openLink.getToken();
        this.project = ProjectResponse.builder().id(openLink.getProject().getId()).build();
        this.openEndDateTime = openLink.getOpenEndDateTime();
        this.opened = openLink.isOpened();
    }


}
