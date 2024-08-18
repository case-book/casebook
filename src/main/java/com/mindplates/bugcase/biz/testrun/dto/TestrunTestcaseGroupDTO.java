package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
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
public class TestrunTestcaseGroupDTO extends CommonDTO implements IDTO<TestrunTestcaseGroup> {

    private Long id;
    private TestrunDTO testrun;
    private TestrunReservationDTO testrunReservation;
    private TestrunIterationDTO testrunIteration;
    private TestcaseGroupDTO testcaseGroup;
    private List<TestrunTestcaseGroupTestcaseDTO> testcases;

    public TestrunTestcaseGroupDTO(TestrunTestcaseGroup testrunTestcaseGroup) {

        this.id = testrunTestcaseGroup.getId();
        if (testrunTestcaseGroup.getTestrun() != null) {
            this.testrun = TestrunDTO.builder().id(testrunTestcaseGroup.getTestrun().getId()).build();
        }

        if (testrunTestcaseGroup.getTestrunReservation() != null) {
            this.testrunReservation = TestrunReservationDTO.builder().id(testrunTestcaseGroup.getTestrunReservation().getId()).build();
        }

        if (testrunTestcaseGroup.getTestrunIteration() != null) {
            this.testrunIteration = TestrunIterationDTO.builder().id(testrunTestcaseGroup.getTestrunIteration().getId()).build();
        }

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

    @Override
    public TestrunTestcaseGroup toEntity() {
        TestrunTestcaseGroup testrunTestcaseGroup = TestrunTestcaseGroup.builder()
            .id(id)
            .testcaseGroup(TestcaseGroup.builder().id(testcaseGroup.getId()).build())
            .build();

        if (testrun != null) {
            testrunTestcaseGroup.setTestrun(Testrun.builder().id(testrun.getId()).build());
        }

        if (testrunReservation != null) {
            testrunTestcaseGroup.setTestrunReservation(TestrunReservation.builder().id(testrunReservation.getId()).build());
        }

        if (testrunIteration != null) {
            testrunTestcaseGroup.setTestrunIteration(TestrunIteration.builder().id(testrunIteration.getId()).build());
        }

        if (testcases != null) {
            testrunTestcaseGroup.setTestcases(testcases.stream().map(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.toEntity(testrunTestcaseGroup)).collect(Collectors.toList()));
        }

        return testrunTestcaseGroup;
    }

    public TestrunTestcaseGroup toEntity(Testrun testrun) {
        TestrunTestcaseGroup testrunTestcaseGroup = toEntity();
        testrunTestcaseGroup.setTestrun(testrun);
        return testrunTestcaseGroup;
    }

    public TestrunTestcaseGroup toEntity(TestrunReservation testrunReservation) {
        TestrunTestcaseGroup testrunTestcaseGroup = toEntity();
        testrunTestcaseGroup.setTestrunReservation(testrunReservation);
        return testrunTestcaseGroup;
    }

    public TestrunTestcaseGroup toEntity(TestrunIteration testrunIteration) {
        TestrunTestcaseGroup testrunTestcaseGroup = toEntity();
        testrunTestcaseGroup.setTestrunIteration(testrunIteration);
        return testrunTestcaseGroup;
    }
}
