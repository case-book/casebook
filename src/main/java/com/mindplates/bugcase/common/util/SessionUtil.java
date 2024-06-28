package com.mindplates.bugcase.common.util;


import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.SecurityUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SessionUtil {


    public SessionUtil() {

    }

    public static Long getUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }

        SecurityUser user = (SecurityUser) authentication.getPrincipal();

        Long id = null;
        if (user != null) {
            id = user.getId();
        }

        return id;
    }

    public static Long getUserId(boolean throwException) {

        Long userId = SessionUtil.getUserId();
        if (userId == null && throwException) {
            throw new ServiceException("session.error.expired");
        }

        return userId;
    }

    public static SecurityUser findSecurityUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return (SecurityUser) authentication.getPrincipal();
        }

        return null;

    }

    public static SecurityUser getSecurityUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return (SecurityUser) authentication.getPrincipal();
        }

        throw new ServiceException("session.error.expired");
    }


    /*
    public Long getUserId(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        SecurityUser user = (SecurityUser)authentication.getPrincipal();

        Long id = null;
        if (user != null) {
            id = user.getId();
        }

        return id;
    }

     */


}
