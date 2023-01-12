package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.TestResultCode;
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
public class TestrunTestcaseGroupTestcaseDTO extends CommonDTO {

    private Long id;
    private TestrunTestcaseGroupDTO testrunTestcaseGroup;
    private TestcaseDTO testcase;
    private List<TestrunTestcaseGroupTestcaseItemDTO> testcaseItems;
    private List<TestrunTestcaseGroupTestcaseCommentDTO> comments;
    private TestResultCode testResult;
    private UserDTO tester;

    public TestrunTestcaseGroupTestcaseDTO(TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase) {

        this.id = testrunTestcaseGroupTestcase.getId();
        this.testrunTestcaseGroup = TestrunTestcaseGroupDTO.builder().id(testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getId()).build();
        this.testcase = TestcaseDTO.builder()
                .id(testrunTestcaseGroupTestcase.getTestcase().getId())
                .seqId(testrunTestcaseGroupTestcase.getTestcase().getSeqId())
                .name(testrunTestcaseGroupTestcase.getTestcase().getName())
                .description(testrunTestcaseGroupTestcase.getTestcase().getDescription())
                .itemOrder(testrunTestcaseGroupTestcase.getTestcase().getItemOrder())
                .closed(testrunTestcaseGroupTestcase.getTestcase().getClosed())
                .build();

        if (testrunTestcaseGroupTestcase.getTestcase().getTestcaseTemplate() != null) {
            this.testcase.setTestcaseTemplate(TestcaseTemplateDTO.builder().id(testrunTestcaseGroupTestcase.getTestcase().getTestcaseTemplate().getId()).build());
        }

        if (testrunTestcaseGroupTestcase.getTestcase().getTestcaseItems() != null) {
            this.testcase.setTestcaseItems(testrunTestcaseGroupTestcase.getTestcase().getTestcaseItems().stream().map(TestcaseItemDTO::new).collect(Collectors.toList()));
            this.testcaseItems = testrunTestcaseGroupTestcase.getTestcaseItems().stream().map(TestrunTestcaseGroupTestcaseItemDTO::new).collect(Collectors.toList());
        }
        this.testResult = testrunTestcaseGroupTestcase.getTestResult();
        this.tester = UserDTO.builder().id(testrunTestcaseGroupTestcase.getTester().getId()).build();
        if (testrunTestcaseGroupTestcase.getComments() != null) {
            this.comments = testrunTestcaseGroupTestcase.getComments().stream().map(TestrunTestcaseGroupTestcaseCommentDTO::new).collect(Collectors.toList());
        }
    }


}
