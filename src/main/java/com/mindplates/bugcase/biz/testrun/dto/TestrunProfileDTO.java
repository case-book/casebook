package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunProfile;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunProfileDTO extends CommonDTO implements IDTO<TestrunProfile> {

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

    @Override
    public TestrunProfile toEntity() {
        TestrunProfile testrunProfile = TestrunProfile.builder()
            .itemOrder(itemOrder)
            .build();

        if (testrun != null) {
            testrunProfile.setTestrun(Testrun.builder().id(testrun.getId()).build());
        }

        if (testrunIteration != null) {
            testrunProfile.setTestrunIteration(TestrunIteration.builder().id(testrunIteration.getId()).build());
        }

        if (testrunReservation != null) {
            testrunProfile.setTestrunReservation(TestrunReservation.builder().id(testrunReservation.getId()).build());
        }

        if (profile != null) {
            testrunProfile.setProfile(SpaceProfile.builder().id(profile.getId()).build());
        }

        return testrunProfile;

    }

    public TestrunProfile toEntity(Testrun testrun) {
        TestrunProfile testrunProfile = toEntity();
        testrunProfile.setTestrun(testrun);
        return testrunProfile;
    }

    public TestrunProfile toEntity(TestrunReservation testrunReservation) {
        TestrunProfile testrunProfile = toEntity();
        testrunProfile.setTestrunReservation(testrunReservation);
        return testrunProfile;
    }

    public TestrunProfile toEntity(TestrunIteration testrunIteration) {
        TestrunProfile testrunProfile = toEntity();
        testrunProfile.setTestrunIteration(testrunIteration);
        return testrunProfile;
    }


}
