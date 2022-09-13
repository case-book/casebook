package com.mindplates.bugcase.biz.user.vo.response;

import com.mindplates.bugcase.common.entity.RoleCode;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SimpleUserResponse {
    private Long id;
    private Long userId;
    private RoleCode role;
    private String email;
    private String name;
    private String alias;
    private String imageType;
    private String imageData;
    private String tags;

}
