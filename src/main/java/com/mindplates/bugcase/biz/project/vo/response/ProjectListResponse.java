package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.stream.Collectors;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectListResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean activated;
    private int testcaseCount;
    private int bugCount;
    private int testrunCount;

    public ProjectListResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.testcaseCount = project.getTestcaseGroups().stream().reduce(0, (subtotal, testcaseGroup) -> subtotal + testcaseGroup.getTestcases().size(), Integer::sum);
        this.testrunCount = (int) project.getTestruns().stream().filter((Testrun::isOpened)).count();
        this.bugCount = 0;
    }


}
