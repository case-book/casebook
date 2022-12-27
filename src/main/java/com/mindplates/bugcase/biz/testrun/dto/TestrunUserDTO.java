package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.user.entity.User;
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
    private User user;
    private TestrunDTO testrun;

}
