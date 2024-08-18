package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestcaseUpdateRequest implements IRequestVO<TestcaseDTO> {

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


    @Override
    public TestcaseDTO toDTO() {
        TestcaseDTO testcase = TestcaseDTO.builder()
            .id(id)
            .project(ProjectDTO.builder().id(projectId).build())
            .testcaseGroup(TestcaseGroupDTO.builder().id(testcaseGroupId).build())
            .testcaseTemplate(TestcaseTemplateDTO.builder().id(testcaseTemplateId).build())
            .name(name)
            .description(description)
            .itemOrder(itemOrder)
            .closed(closed)
            .testcaseItems(testcaseItems.stream().map((TestcaseItemRequest::toDTO)).collect(Collectors.toList()))
            .testerType(testerType)
            .testerValue(testerValue)
            .build();

        if (projectReleaseIds != null) {
            testcase.setProjectReleases(
                projectReleaseIds.stream()
                    .map(projectReleaseId ->
                        ProjectReleaseDTO
                            .builder()
                            .id(projectReleaseId)
                            .build())
                    .collect(Collectors.toList())
            );
        }

        return testcase;
    }
}
