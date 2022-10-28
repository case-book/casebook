package com.mindplates.bugcase.common.util;


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

  public static SecurityUser getSecurityUser() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return (SecurityUser) authentication.getPrincipal();
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
