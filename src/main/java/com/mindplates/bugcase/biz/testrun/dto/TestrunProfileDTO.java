package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunProfile;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunProfileDTO extends CommonDTO {

    private TestrunDTO testrun;
    private TestrunIterationDTO testrunIteration;
    private TestrunReservationDTO testrunReservation;
    private SpaceProfileDTO profile;
    private Integer itemOrder;

    public TestrunProfileDTO(TestrunProfile testrunProfile) {
        if (testrunProfile.getTestrun() != null) {
            this.testrun = TestrunDTO.builder().id(testrunProfile.getTestrun().getId()).build();
        }

        if (testrunProfile.getTestrunIteration() != null) {
            this.testrunIteration = TestrunIterationDTO.builder().id(testrunProfile.getTestrunIteration().getId()).build();
        }

        if (testrunProfile.getTestrunReservation() != null) {
            this.testrunReservation = TestrunReservationDTO.builder().id(testrunProfile.getTestrunReservation().getId()).build();
        }

        if (testrunProfile.getProfile() != null) {
            this.profile = SpaceProfileDTO.builder().id(testrunProfile.getProfile().getId()).build();
        }

        this.itemOrder = testrunProfile.getItemOrder();
    }

}
