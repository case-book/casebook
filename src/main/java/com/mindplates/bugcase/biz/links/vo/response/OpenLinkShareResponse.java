package com.mindplates.bugcase.biz.links.vo.response;

import com.mindplates.bugcase.biz.links.dto.OpenLinkDTO;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunResponse;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.vo.response.SimpleUserResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OpenLinkShareResponse {

    private Long id;
    private String name;
    private String token;
    private ProjectResponse project;
    private LocalDateTime openEndDateTime;
    private boolean opened;
    private List<TestrunResponse> testruns;
    private List<SimpleUserResponse> users;
    private List<TestcaseTemplateResponse> testcaseTemplates;
    private String comment;

    public OpenLinkShareResponse(OpenLinkDTO openLink, List<UserDTO> users, List<TestcaseTemplateDTO> testcaseTemplates) {
        this.id = openLink.getId();
        this.name = openLink.getName();
        this.token = openLink.getToken();
        this.project = ProjectResponse.builder().id(openLink.getProject().getId()).build();
        this.openEndDateTime = openLink.getOpenEndDateTime();
        this.opened = openLink.isOpened();
        this.comment = openLink.getComment();
        this.testruns = openLink.getTestruns().stream().map(testrun -> new TestrunResponse(testrun.getTestrun())).collect(Collectors.toList());
        this.testcaseTemplates = testcaseTemplates.stream().map(TestcaseTemplateResponse::new).collect(Collectors.toList());
        this.users = users.stream().map(SimpleUserResponse::new).collect(Collectors.toList());
    }


}
