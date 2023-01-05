package com.mindplates.bugcase.biz.testrun.dto;

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

}
