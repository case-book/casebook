package com.mindplates.bugcase.biz.links.dto;

import com.mindplates.bugcase.biz.links.entity.OpenLink;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.time.LocalDateTime;
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
public class OpenLinkDTO extends CommonDTO implements IDTO<OpenLink> {

    private Long id;
    private String name;
    private String token;
    private ProjectDTO project;
    private List<OpenLinkTestrunDTO> testruns;
    private LocalDateTime openEndDateTime;
    private boolean opened;

    public OpenLinkDTO(OpenLink openLink) {
        this.id = openLink.getId();
        this.name = openLink.getName();
        this.token = openLink.getToken();
        this.project = ProjectDTO.builder().id(openLink.getProject().getId()).build();
        this.testruns = openLink.getTestruns().stream().map(OpenLinkTestrunDTO::new).collect(Collectors.toList());
        this.openEndDateTime = openLink.getOpenEndDateTime();
        this.opened = openLink.isOpened();

    }


    @Override
    public OpenLink toEntity() {
        OpenLink openLink = OpenLink.builder()
            .id(id)
            .name(name)
            .token(token)
            .project(Project.builder().id(project.getId()).build())
            .openEndDateTime(openEndDateTime)
            .opened(opened)
            .build();

        openLink.setTestruns(testruns
            .stream()
            .map(openLinkTestrunDTO -> openLinkTestrunDTO.toEntity(openLink)).collect(Collectors.toList()));

        return openLink;
    }
}
