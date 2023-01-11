package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.*;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupDTO extends CommonDTO {

    private Long id;
    private TestrunDTO testrun;
    private TestcaseGroupDTO testcaseGroup;
    private List<TestrunTestcaseGroupTestcaseDTO> testcases;
    public TestrunTestcaseGroupDTO (TestrunTestcaseGroup testrunTestcaseGroup) {

        this.id = testrunTestcaseGroup.getId();
        this.testrun = TestrunDTO.builder().id(testrunTestcaseGroup.getTestrun().getId()).build();
        this.testcaseGroup = TestcaseGroupDTO.builder()
                .id(testrunTestcaseGroup.getTestcaseGroup().getId())
                .seqId(testrunTestcaseGroup.getTestcaseGroup().getSeqId())
                .parentId(testrunTestcaseGroup.getTestcaseGroup().getParentId())
                .depth(testrunTestcaseGroup.getTestcaseGroup().getDepth())
                .name(testrunTestcaseGroup.getTestcaseGroup().getName())
                .description(testrunTestcaseGroup.getTestcaseGroup().getDescription())
                .itemOrder(testrunTestcaseGroup.getTestcaseGroup().getItemOrder())
                .build();

        if (testrunTestcaseGroup.getTestcases() != null) {
            this.testcases = testrunTestcaseGroup.getTestcases().stream().map(TestrunTestcaseGroupTestcaseDTO::new).collect(Collectors.toList());
        }







    }

}
