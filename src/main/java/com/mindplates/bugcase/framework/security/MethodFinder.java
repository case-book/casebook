package com.mindplates.bugcase.framework.security;

import java.lang.reflect.Method;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.FilterInvocation;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
public class MethodFinder {

    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    public Method findMethod(FilterInvocation fi) {
        HttpServletRequest request = fi.getHttpRequest();
        try {
            HandlerMethod handlerMethod = (HandlerMethod) handlerMapping.getHandler(request).getHandler();
            if (handlerMethod != null) {
                return handlerMethod.getMethod();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
