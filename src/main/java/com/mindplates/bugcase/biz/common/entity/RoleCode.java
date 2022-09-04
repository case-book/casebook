package com.mindplates.bugcase.biz.common.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum RoleCode {

    SUPER_MAN("ROOT"),
    ADMIN("ADMIN"),
    MEMBER("MEMBER");
    private String code;

}
