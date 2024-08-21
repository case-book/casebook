package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectMessageChannel;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunMessageChannel;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestrunMessageChannelDTO extends CommonDTO implements IDTO<TestrunMessageChannel> {

    private Long id;
    private TestrunDTO testrun;
    private TestrunReservationDTO testrunReservation;
    private TestrunIterationDTO testrunIteration;
    private ProjectMessageChannelDTO messageChannel;

    public TestrunMessageChannelDTO(TestrunMessageChannel testrunMessageChannel) {
        this.id = testrunMessageChannel.getId();
        if (testrunMessageChannel.getTestrun() != null) {
            this.testrun = TestrunDTO.builder().id(testrunMessageChannel.getTestrun().getId()).build();
        }

        if (testrunMessageChannel.getTestrunReservation() != null) {
            this.testrunReservation = TestrunReservationDTO.builder().id(testrunMessageChannel.getTestrunReservation().getId()).build();
        }

        if (testrunMessageChannel.getTestrunIteration() != null) {
            this.testrunIteration = TestrunIterationDTO.builder().id(testrunMessageChannel.getTestrunIteration().getId()).build();
        }

        this.messageChannel = new ProjectMessageChannelDTO(testrunMessageChannel.getMessageChannel());
    }


    @Override
    public TestrunMessageChannel toEntity() {
        TestrunMessageChannel testrunMessageChannel =
            TestrunMessageChannel.builder()
                .id(id)
                .messageChannel(ProjectMessageChannel.builder().id(messageChannel.getId()).build())
                .build();

        if (testrun != null) {
            testrunMessageChannel.setTestrun(Testrun.builder().id(testrun.getId()).build());
        }

        if (testrunReservation != null) {
            testrunMessageChannel.setTestrunReservation(TestrunReservation.builder().id(testrunReservation.getId()).build());
        }

        if (testrunIteration != null) {
            testrunMessageChannel.setTestrunIteration(TestrunIteration.builder().id(testrunIteration.getId()).build());
        }

        return testrunMessageChannel;

    }

    public TestrunMessageChannel toEntity(Testrun testrun) {
        TestrunMessageChannel testrunMessageChannel = toEntity();
        testrunMessageChannel.setTestrun(testrun);
        return testrunMessageChannel;
    }

    public TestrunMessageChannel toEntity(TestrunReservation testrunReservation) {
        TestrunMessageChannel testrunMessageChannel = toEntity();
        testrunMessageChannel.setTestrunReservation(testrunReservation);
        return testrunMessageChannel;
    }

    public TestrunMessageChannel toEntity(TestrunIteration testrunIteration) {
        TestrunMessageChannel testrunMessageChannel = toEntity();
        testrunMessageChannel.setTestrunIteration(testrunIteration);
        return testrunMessageChannel;
    }
}
