package com.mindplates.bugcase.framework.websocket.interceptor;

import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.SecurityUser;
import com.mindplates.bugcase.framework.security.JwtTokenProvider;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@AllArgsConstructor
@Slf4j
public class FilterChannelInterceptor implements ChannelInterceptor {
    public static final Pattern USER_SUB_PATTERN = Pattern.compile("^/sub/users/(.*)?$");
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        assert headerAccessor != null;
        if (headerAccessor.getCommand() == StompCommand.CONNECT) {
            String token = String.valueOf(headerAccessor.getNativeHeader("X-AUTH-TOKEN").get(0));

            if (token != null && jwtTokenProvider.validateToken(token)) {
                Authentication auth = jwtTokenProvider.getAuthentication(token);

                SecurityUser securityUser = (SecurityUser) auth.getPrincipal();
                if (securityUser != null) {
                    Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
                    if (sessionAttributes != null) {
                        sessionAttributes.put("USER_ID", String.valueOf(securityUser.getId()));
                        headerAccessor.setSessionAttributes(sessionAttributes);
                    }
                }
            }
        } else if (StompCommand.SUBSCRIBE.equals(headerAccessor.getCommand())) {
            validateSubscriptionHeader(headerAccessor);
        }
        return message;
    }

    private void validateSubscriptionHeader(StompHeaderAccessor headerAccessor) {
        String userId = (String) headerAccessor.getSessionAttributes().get("USER_ID");
        String destination = headerAccessor.getDestination();

        if (StringUtils.isBlank(userId)) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED);
        }

        Matcher userSubMatcher = USER_SUB_PATTERN.matcher(destination);
        if (userSubMatcher.matches()) {
            String subUserId = userSubMatcher.group(1);
            if (!userId.equals(subUserId)) {
                throw new ServiceException(HttpStatus.FORBIDDEN);
            }
        }
    }
}
