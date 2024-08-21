package com.mindplates.bugcase.framework.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.common.exception.ServiceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final MessageSourceAccessor messageSourceAccessor;
    private final ObjectMapper objectMapper;


    public String getOrigin(HttpServletRequest request) {
        return request.getHeader("Origin");
    }

    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServiceException {

        httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());

        String requestOrigin = getOrigin(httpServletRequest);

        // CORS 헤더 추가
        httpServletResponse.setHeader("Access-Control-Allow-Origin", requestOrigin);
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        httpServletResponse.setHeader("Access-Control-Allow-Credentials", "true");

        try (OutputStream os = httpServletResponse.getOutputStream()) {
            objectMapper.writeValue(os, messageSourceAccessor.getMessage("session.error.expired"));
            os.flush();
        }
    }
}
