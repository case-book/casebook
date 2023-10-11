package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectReleaseId;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestcaseCreateRequest {

    private Long id;
    private Long testcaseGroupId;
    private String name;
    private Integer itemOrder;
    private List<Long> projectReleaseIds;

    public Testcase buildEntity() {

        Testcase testcase = Testcase.builder()
            .id(id)
            .testcaseGroup(TestcaseGroup.builder().id(testcaseGroupId).build())
            .name(name)
            .itemOrder(itemOrder)
            .build();

        testcase.setTestcaseProjectReleases(
            projectReleaseIds.stream()
                .map(projectReleaseId -> {
                    return TestcaseProjectRelease.builder()

                        .testcase(Testcase.builder().id(testcase.getId()).build())
                        .projectRelease(ProjectRelease.builder().id(projectReleaseId).build())
                        .build();
                })
                .collect(Collectors.toList())
        );

        return testcase;
    }
}
