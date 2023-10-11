package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunUserResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String avatarInfo;

    public TestrunUserResponse(TestrunUserDTO testrunUser) {
        this.id = testrunUser.getId();
        this.userId = testrunUser.getUser().getId();
        this.name = testrunUser.getUser().getName();
        this.email = testrunUser.getUser().getEmail();
        this.avatarInfo = testrunUser.getUser().getAvatarInfo();
    }


}
