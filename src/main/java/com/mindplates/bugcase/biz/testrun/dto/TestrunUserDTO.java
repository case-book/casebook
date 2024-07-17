package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
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
public class TestrunUserDTO extends CommonDTO implements IDTO<TestrunUser> {

    private Long id;
    private UserDTO user;
    private TestrunDTO testrun;
    private TestrunReservationDTO testrunReservation;
    private TestrunIterationDTO testrunIteration;

    public TestrunUserDTO(TestrunUser testrunUser) {
        this.id = testrunUser.getId();
        this.user = UserDTO.builder().id(testrunUser.getUser().getId()).email(testrunUser.getUser().getEmail()).name(testrunUser.getUser().getName()).avatarInfo(testrunUser.getUser().getAvatarInfo())
            .build();
    }

    @Override
    public TestrunUser toEntity() {
        TestrunUser testrunUser = TestrunUser
            .builder()
            .id(id)
            .user(User.builder().id(user.getId()).build())
            .build();

        if (testrun != null) {
            testrunUser.setTestrun(Testrun.builder().id(testrun.getId()).build());
        }

        if (testrunReservation != null) {
            testrunUser.setTestrunReservation(TestrunReservation.builder().id(testrunReservation.getId()).build());
        }

        if (testrunIteration != null) {
            testrunUser.setTestrunIteration(TestrunIteration.builder().id(testrunIteration.getId()).build());
        }

        return testrunUser;
    }


    public TestrunUser toEntity(Testrun testrun) {
        TestrunUser testrunUser = toEntity();
        testrunUser.setTestrun(testrun);
        return testrunUser;
    }

    public TestrunUser toEntity(TestrunReservation testrunReservation) {
        TestrunUser testrunUser = toEntity();
        testrunUser.setTestrunReservation(testrunReservation);
        return testrunUser;
    }

    public TestrunUser toEntity(TestrunIteration testrunIteration) {
        TestrunUser testrunUser = toEntity();
        testrunUser.setTestrunIteration(testrunIteration);
        return testrunUser;
    }
}
