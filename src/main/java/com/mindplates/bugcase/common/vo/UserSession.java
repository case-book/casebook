package com.mindplates.bugcase.common.vo;

import com.mindplates.bugcase.common.entity.RoleCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSession implements Serializable {
    private Long id;
    private String uuid;
    private RoleCode roleCode;
    private String token;
    private String nickname;
}
