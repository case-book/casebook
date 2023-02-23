package com.mindplates.bugcase.framework.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.ErrorResponse;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class ExceptionHandlerFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private MessageSourceAccessor messageSourceAccessor;

    public ExceptionHandlerFilter (MessageSourceAccessor messageSourceAccessor) {
        this.messageSourceAccessor = messageSourceAccessor;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (ServiceException e) {
            log.error(e.getMessage(), e);
            if (e.getMessageCode() != null) {
                String message = messageSourceAccessor.getMessage(e.getMessageCode(), e.getMessageParameters());
                setErrorResponse(response, e.getCode(), message);
            } else {
                setErrorResponse(response, e.getCode(), "");
            }
        } catch (JwtException | IllegalArgumentException e) {
            log.error(e.getMessage(), e);
            String message = messageSourceAccessor.getMessage("session.error.expired");
            setErrorResponse(response, HttpStatus.UNAUTHORIZED, message);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            String message = messageSourceAccessor.getMessage("common.error.unknownError");
            setErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    private void setErrorResponse(HttpServletResponse response, HttpStatus httpStatus, String errorMsg) {

        response.setStatus(httpStatus.value());
        response.setCharacterEncoding("utf-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        try {
            response.getWriter().write(objectMapper.writeValueAsString(ErrorResponse.builder().code(httpStatus).message(errorMsg).build()));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
