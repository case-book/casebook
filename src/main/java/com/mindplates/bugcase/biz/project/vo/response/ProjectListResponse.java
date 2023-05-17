package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectListResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean activated;
    private long testcaseCount;
    private int bugCount;
    private long testrunCount;

    public ProjectListResponse(ProjectDTO project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.testcaseCount = project.getTestcaseCount();
        this.testrunCount = project.getTestrunCount();
        this.bugCount = 0;
    }


}
