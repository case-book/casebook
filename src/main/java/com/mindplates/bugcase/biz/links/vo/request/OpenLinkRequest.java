package com.mindplates.bugcase.biz.links.vo.request;

import com.mindplates.bugcase.biz.links.dto.OpenLinkDTO;
import com.mindplates.bugcase.biz.links.dto.OpenLinkTestrunDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class OpenLinkRequest {

    private Long id;
    private String name;
    private LocalDateTime openEndDateTime;
    private boolean opened;
    private List<Long> testrunIds;
    private String comment;

    public OpenLinkDTO toDTO(long projectId) {
        OpenLinkDTO openLink = OpenLinkDTO.builder()
            .id(id)
            .name(name)
            .openEndDateTime(openEndDateTime)
            .opened(opened)
            .project(ProjectDTO.builder().id(projectId).build())
            .comment(comment)
            .build();

        openLink.setTestruns(testrunIds.stream().map(testrunId -> {
            OpenLinkTestrunDTO openLinkTestrun = new OpenLinkTestrunDTO();
            openLinkTestrun.setTestrun(TestrunDTO.builder().id(testrunId).build());
            openLinkTestrun.setOpenLink(openLink);
            return openLinkTestrun;
        }).collect(Collectors.toList()));

        return openLink;


    }

}
