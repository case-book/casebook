package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseDTO extends CommonDTO implements IDTO<TestrunTestcaseGroupTestcase> {

    private Long id;
    private TestrunTestcaseGroupDTO testrunTestcaseGroup;
    private TestcaseDTO testcase;
    private List<TestrunTestcaseGroupTestcaseItemDTO> testcaseItems;
    private List<TestrunTestcaseGroupTestcaseCommentDTO> comments;
    private TestResultCode testResult;
    private UserDTO tester;

    public TestrunTestcaseGroupTestcaseDTO(TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase) {

        this.id = testrunTestcaseGroupTestcase.getId();
        this.testrunTestcaseGroup = TestrunTestcaseGroupDTO.builder()
            .id(testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getId())
            .build();

        if (testrunTestcaseGroupTestcase != null && testrunTestcaseGroupTestcase.getTestrunTestcaseGroup() != null && testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getTestrun() != null) {
            this.testrunTestcaseGroup
                .setTestrun(TestrunDTO
                    .builder()
                    .id(testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getTestrun().getId())
                    .seqId(testrunTestcaseGroupTestcase.getTestrunTestcaseGroup().getTestrun().getSeqId())
                    .build()
                );
        }

        this.testcase = TestcaseDTO.builder()
            .id(testrunTestcaseGroupTestcase.getTestcase().getId())
            .seqId(testrunTestcaseGroupTestcase.getTestcase().getSeqId())
            .name(testrunTestcaseGroupTestcase.getTestcase().getName())
            .description(testrunTestcaseGroupTestcase.getTestcase().getDescription())
            .itemOrder(testrunTestcaseGroupTestcase.getTestcase().getItemOrder())
            .closed(testrunTestcaseGroupTestcase.getTestcase().getClosed())
            .build();

        this.testcase.setCreationDate(testrunTestcaseGroupTestcase.getTestcase().getCreationDate());
        this.testcase.setLastUpdateDate(testrunTestcaseGroupTestcase.getTestcase().getLastUpdateDate());

        if (testrunTestcaseGroupTestcase.getTestcase().getTestcaseTemplate() != null) {
            this.testcase.setTestcaseTemplate(
                TestcaseTemplateDTO.builder().id(testrunTestcaseGroupTestcase.getTestcase().getTestcaseTemplate().getId()).build());
        }

        if (testrunTestcaseGroupTestcase.getTestcase().getTestcaseItems() != null) {
            this.testcase.setTestcaseItems(
                testrunTestcaseGroupTestcase.getTestcase().getTestcaseItems().stream().map(TestcaseItemDTO::new).collect(Collectors.toList()));
            if (testrunTestcaseGroupTestcase.getTestcaseItems() != null) {
                this.testcaseItems = testrunTestcaseGroupTestcase.getTestcaseItems().stream().map(TestrunTestcaseGroupTestcaseItemDTO::new)
                    .collect(Collectors.toList());
            }
        }
        this.testResult = testrunTestcaseGroupTestcase.getTestResult();
        if (testrunTestcaseGroupTestcase.getTester() != null) {
            this.tester = UserDTO.builder().id(testrunTestcaseGroupTestcase.getTester().getId()).build();
        }
        if (testrunTestcaseGroupTestcase.getComments() != null) {
            this.comments = testrunTestcaseGroupTestcase.getComments().stream().map(TestrunTestcaseGroupTestcaseCommentDTO::new)
                .collect(Collectors.toList());
        }
    }

    public TestrunTestcaseGroupTestcaseDTO(TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase, User createdUser, User lastUpdatedUser) {
        this(testrunTestcaseGroupTestcase);
        if (createdUser != null) {
            this.testcase.setCreatedUserName(createdUser.getName());
        }
        if (lastUpdatedUser != null) {
            this.testcase.setLastUpdatedUserName(lastUpdatedUser.getName());
        }
    }


    @Override
    public TestrunTestcaseGroupTestcase toEntity() {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = TestrunTestcaseGroupTestcase.builder()
            .id(id)
            .testcase(Testcase.builder().id(testcase.getId()).build())
            .testResult(testResult)
            .build();

        if (testrunTestcaseGroup != null) {
            testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(TestrunTestcaseGroup.builder().id(testrunTestcaseGroup.getId()).build());
        }

        if (tester != null) {
            testrunTestcaseGroupTestcase.setTester(User.builder().id(tester.getId()).build());
        }

        if (testcaseItems != null) {
            testrunTestcaseGroupTestcase.setTestcaseItems(testcaseItems.stream().map(testrunTestcaseGroupTestcaseItem -> testrunTestcaseGroupTestcaseItem.toEntity(testrunTestcaseGroupTestcase)).collect(Collectors.toList()));
        }

        return testrunTestcaseGroupTestcase;
    }

    public TestrunTestcaseGroupTestcase toEntity(TestrunTestcaseGroup testrunTestcaseGroup) {
        TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase = toEntity();
        testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
        return testrunTestcaseGroupTestcase;

    }
}
