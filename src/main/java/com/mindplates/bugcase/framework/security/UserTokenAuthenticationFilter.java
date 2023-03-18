package com.mindplates.bugcase.framework.security;

import io.jsonwebtoken.JwtException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class UserTokenAuthenticationFilter extends GenericFilterBean {

    private final UserTokenProvider userTokenProvider;

    public UserTokenAuthenticationFilter(UserTokenProvider userTokenProvider) {
        this.userTokenProvider = userTokenProvider;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        String token = userTokenProvider.resolveToken((HttpServletRequest) request);

        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null && SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            filterChain.doFilter(request, response);
        } else if (token != null && userTokenProvider.validateToken(token)) {
            Authentication auth = userTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            filterChain.doFilter(request, response);
        } else {
            throw new JwtException("session.error.expired");
        }
    }
}
