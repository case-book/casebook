package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
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
    private Long projectReleaseId;

    public TestcaseDTO buildEntity() {
        return TestcaseDTO.builder()
            .id(id)
            .project(ProjectDTO.builder().id(projectId).build())
            .testcaseGroup(TestcaseGroupDTO.builder().id(testcaseGroupId).build())
            .testcaseTemplate(TestcaseTemplateDTO.builder().id(testcaseTemplateId).build())
            .name(name)
            .description(description)
            .itemOrder(itemOrder)
            .closed(closed)
            .testcaseItems(testcaseItems.stream().map(TestcaseItemRequest::buildEntity).collect(Collectors.toList()))
            .testerType(testerType)
            .testerValue(testerValue)
            .projectRelease(ProjectReleaseDTO.builder().id(projectReleaseId).build())
            .build();
    }
}
