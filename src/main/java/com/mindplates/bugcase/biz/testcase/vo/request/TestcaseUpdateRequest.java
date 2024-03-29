package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectReleaseId;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestcaseUpdateRequest {

    private Long id;
    private Long testcaseGroupId;
    private Long projectId;
    private Long testcaseTemplateId;
    private String name;
    private String description;
    private Integer itemOrder;
    private Boolean closed;
    private List<TestcaseItemRequest> testcaseItems;
    private String testerType;
    private String testerValue;
    private List<Long> projectReleaseIds;

    public Testcase buildEntity() {
        Testcase testcase = Testcase.builder()
            .id(id)
            .project(Project.builder().id(projectId).build())
            .testcaseGroup(TestcaseGroup.builder().id(testcaseGroupId).build())
            .testcaseTemplate(TestcaseTemplate.builder().id(testcaseTemplateId).build())
            .name(name)
            .description(description)
            .itemOrder(itemOrder)
            .closed(closed)
            .testcaseItems(testcaseItems.stream().map(TestcaseItemRequest::buildEntity).collect(Collectors.toList()))
            .testerType(testerType)
            .testerValue(testerValue)
            .build();

        if (projectReleaseIds != null) {
            testcase.setTestcaseProjectReleases(
                projectReleaseIds.stream()
                    .map(projectReleaseId -> TestcaseProjectRelease.builder()
                        .testcase(Testcase.builder().id(testcase.getId()).build())
                        .projectRelease(ProjectRelease.builder().id(projectReleaseId).build())
                        .build())
                    .collect(Collectors.toList())
            );
        }

        return testcase;
    }
}
