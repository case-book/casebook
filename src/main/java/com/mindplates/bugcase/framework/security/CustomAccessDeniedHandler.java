package com.mindplates.bugcase.framework.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.io.IOException;
import java.io.OutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final MessageSourceAccessor messageSourceAccessor;
    private final ObjectMapper objectMapper;

    public String getOrigin(HttpServletRequest request) {
        return request.getHeader("Origin");
    }

    @Override
    public void handle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AccessDeniedException e) throws IOException, ServiceException {

        String requestOrigin = getOrigin(httpServletRequest);

        httpServletResponse.setHeader("Access-Control-Allow-Origin", requestOrigin);
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        httpServletResponse.setHeader("Access-Control-Allow-Credentials", "true");

        httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        httpServletResponse.setStatus(HttpStatus.FORBIDDEN.value());
        try (OutputStream os = httpServletResponse.getOutputStream()) {
            objectMapper.writeValue(os, messageSourceAccessor.getMessage("access.denied"));
            os.flush();
        }
    }
}
