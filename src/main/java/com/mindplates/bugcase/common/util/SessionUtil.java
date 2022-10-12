package com.mindplates.bugcase.common.util;


import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.constraints.Keys;
import com.mindplates.bugcase.common.entity.RoleCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.UserSession;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;
import java.util.UUID;

@Component
public class SessionUtil {


    public SessionUtil() {

    }

    public static Long getUserId() {

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        Long id = null;
        HttpSession session = request.getSession(false);
        if (session != null) {
            UserSession userSession = (UserSession) session.getAttribute(Keys.SESSION_KEY);
            if (userSession != null) {
                id = userSession.getId();
            }
        }

        return id;
    }

    public static UserSession getUserSessionInfo(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            return (UserSession) session.getAttribute(Keys.SESSION_KEY);
        } else {
            return null;
        }

    }

    public static UserSession getUserInfo(SimpMessageHeaderAccessor headerAccessor) {
        Map<String, Object> attributes = headerAccessor.getSessionAttributes();
        if (attributes == null) {
            throw new ServiceException("session.error.expired");
        }

        return (UserSession) attributes.get("USER_INFO");

    }

    public boolean isLogin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            UserSession userSession = (UserSession) session.getAttribute(Keys.SESSION_KEY);
            return userSession != null && userSession.getId() != null;
        }

        return false;
    }

    public boolean isAdmin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            UserSession userSession = (UserSession) session.getAttribute(Keys.SESSION_KEY);
            return userSession != null && userSession.getRoleCode().equals(RoleCode.ADMIN);
        }

        return false;
    }


    public UserSession getUserInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            UserSession userSession = (UserSession) session.getAttribute(Keys.SESSION_KEY);
            return userSession;
        }

        return null;
    }

    public String getUserToken(HttpServletRequest request) {
        String token = null;
        HttpSession session = request.getSession(false);
        if (session != null) {
            UserSession userSession = (UserSession) session.getAttribute(Keys.SESSION_KEY);
            if (userSession != null) {
                token = userSession.getToken();
            }
        }

        return token;
    }

    public Long getUserId(HttpServletRequest request) {
        Long id = null;
        HttpSession session = request.getSession(false);
        if (session != null) {
            UserSession userSession = (UserSession) session.getAttribute(Keys.SESSION_KEY);
            if (userSession != null) {
                id = userSession.getId();
            }
        }

        return id;
    }

    public void login(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        session = request.getSession(true);

        UserSession info = UserSession.builder()
                .token(UUID.randomUUID().toString())
                .build();

        session.setAttribute(Keys.SESSION_KEY, info);

    }

    public void login(HttpServletRequest request, User user) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        session = request.getSession(true);

        UserSession info = UserSession.builder()
                .id(user.getId())
                .roleCode(user.getActiveRoleCode())
                .token(UUID.randomUUID().toString())
                .build();

        session.setMaxInactiveInterval(60 * 60 * 24);
        session.setAttribute(Keys.SESSION_KEY, info);

    }

    public UserSession logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            UserSession userSession = (UserSession) session.getAttribute(Keys.SESSION_KEY);
            if (userSession != null) {
                userSession.setId(null);
                userSession.setUuid(null);
                userSession.setRoleCode(null);
                session.setAttribute(Keys.SESSION_KEY, userSession);

                return userSession;
            }
        }

        return null;
    }

    public String getClientIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("HTTP_X_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("HTTP_X_CLUSTER_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("HTTP_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("HTTP_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("HTTP_VIA");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getHeader("REMOTE_ADDR");
        }
        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

}
