package com.mindplates.bugcase.framework.interceptor;

import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.annotation.DisableLogin;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@AllArgsConstructor
public class LoginCheckInterceptor implements HandlerInterceptor {

    private final SessionUtil sessionUtil;

    private final UserService userService;

    public LoginCheckInterceptor(UserService userService, SessionUtil sessionUtil) {
        this.userService = userService;
        this.sessionUtil = sessionUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        if (!sessionUtil.isLogin(request)) {
            String uuid = request.getHeader("uuid");
            if (!StringUtils.isBlank(uuid)) {
                User user = userService.selectUserByUuid(uuid);
                if (user != null) {
                    sessionUtil.login(request, user);
                }
            }
        }

        DisableLogin disableLogin = null;

        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        if (handler instanceof HandlerMethod) {
            disableLogin = ((HandlerMethod) handler).getMethodAnnotation(DisableLogin.class);
        }

        if (disableLogin != null) {
            return true;
        }

        if (!sessionUtil.isLogin(request)) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "error.session");
        }

        return true;
    }

}
