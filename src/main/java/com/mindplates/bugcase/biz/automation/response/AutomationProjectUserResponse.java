package com.mindplates.bugcase.biz.automation.response;

import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AutomationProjectUserResponse {

    private Long userId;
    private String name;
    private String email;
    private UserRoleCode role;
    private String tags;

    public AutomationProjectUserResponse(ProjectUserDTO projectUser) {
        this.userId = projectUser.getUser() != null ? projectUser.getUser().getId() : null;
        this.name = projectUser.getUser() != null ? projectUser.getUser().getName() : null;
        this.email = projectUser.getUser() != null ? projectUser.getUser().getEmail() : null;
        this.role = projectUser.getRole();
        this.tags = projectUser.getTags();
    }
}
