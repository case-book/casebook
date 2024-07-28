package com.mindplates.bugcase.framework.security;

import com.mindplates.bugcase.common.code.UserRoleCode;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface AllowProjectRole {

    UserRoleCode value();
}
