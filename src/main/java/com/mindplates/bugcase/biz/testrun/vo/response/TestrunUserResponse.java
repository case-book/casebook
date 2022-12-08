package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
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

    public TestrunUserResponse(TestrunUser testrunUser) {
        this.id = testrunUser.getId();
        this.userId = testrunUser.getUser().getId();
        this.name = testrunUser.getUser().getName();
        this.email = testrunUser.getUser().getEmail();
    }


}
