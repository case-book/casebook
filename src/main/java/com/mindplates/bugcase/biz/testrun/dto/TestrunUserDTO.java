package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunUserDTO extends CommonDTO {

    private Long id;
    private UserDTO user;
    private TestrunDTO testrun;
    private TestrunReservationDTO testrunReservation;
    private TestrunIterationDTO testrunIteration;

    public TestrunUserDTO(TestrunUser testrunUser) {
        this.id = testrunUser.getId();
        this.user = UserDTO.builder().id(testrunUser.getUser().getId()).email(testrunUser.getUser().getEmail()).name(testrunUser.getUser().getName()).build();
    }

}
