package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectListDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunListDTO;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunListResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunResponse;
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
public class ProjectTestrunResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean activated;
    private long testcaseCount;
    private int bugCount;
    private long testrunCount;
    private List<TestrunResponse> testruns;

    public ProjectTestrunResponse(ProjectListDTO project, List<TestrunDTO> testruns) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.testcaseCount = project.getTestcaseCount();
        this.testrunCount = project.getTestrunCount();
        this.bugCount = 0;
        this.testruns = testruns.stream().map(TestrunResponse::new).collect(Collectors.toList());


    }


}
