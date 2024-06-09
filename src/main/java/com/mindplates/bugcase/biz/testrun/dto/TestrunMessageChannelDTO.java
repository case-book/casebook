package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunMessageChannel;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunMessageChannelDTO extends CommonDTO {

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


}
