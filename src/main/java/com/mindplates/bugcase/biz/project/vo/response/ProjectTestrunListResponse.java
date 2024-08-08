package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectListDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunListDTO;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunListResponse;
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
public class ProjectTestrunListResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean activated;
    private long testcaseCount;
    private int bugCount;
    private long testrunCount;
    private List<TestrunListResponse> testruns;

    public ProjectTestrunListResponse(ProjectListDTO project, List<TestrunListDTO> testruns) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.testcaseCount = project.getTestcaseCount();
        this.testrunCount = project.getTestrunCount();
        this.bugCount = 0;
        this.testruns = testruns.stream().map(TestrunListResponse::new).collect(Collectors.toList());


    }


}
