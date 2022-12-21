package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.stream.Collectors;

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
    @NotBlank
    private String testerType;
    @NotBlank
    private String testerValue;

    public Testcase buildEntity() {
        return Testcase.builder()
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
    }
}
