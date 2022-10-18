package com.mindplates.bugcase.biz.user.vo.response;

import com.mindplates.bugcase.common.entity.RoleCode;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SimpleSpaceUserResponse {
    private Long id;
    private Long userId;
    private RoleCode role;
    private String email;
    private String name;
}
