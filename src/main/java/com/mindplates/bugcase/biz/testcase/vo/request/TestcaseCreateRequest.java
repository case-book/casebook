package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestcaseCreateRequest implements IRequestVO<TestcaseDTO> {

    private Long id;
    private Long testcaseGroupId;
    private String name;
    private Integer itemOrder;
    private List<Long> projectReleaseIds;


    @Override
    public TestcaseDTO toDTO() {
        TestcaseDTO testcase = TestcaseDTO.builder()
            .id(id)
            .testcaseGroup(TestcaseGroupDTO.builder().id(testcaseGroupId).build())
            .name(name)
            .itemOrder(itemOrder)
            .build();

        if (projectReleaseIds != null) {
            testcase.setProjectReleases(projectReleaseIds.stream().map(projectReleaseId -> ProjectReleaseDTO.builder().id(projectReleaseId).build()).collect(Collectors.toList()));
        }

        return testcase;
    }

    public TestcaseDTO toDTO(long projectId, long testcaseGroupId) {
        TestcaseDTO testcaseDTO = toDTO();
        testcaseDTO.getTestcaseGroup().setId(testcaseGroupId);
        testcaseDTO.setProject(ProjectDTO.builder().id(projectId).build());
        return testcaseDTO;
    }
}
