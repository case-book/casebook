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

import java.util.HashMap;
import java.util.List;
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
            Map<String, String> extensionHeaderMap = new HashMap<>();
            Map<String, List<String>> nativeHeaderMap = headerAccessor.toNativeHeaderMap();
            for (Map.Entry<String, List<String>> entry : nativeHeaderMap.entrySet()) {
                if (entry.getKey().indexOf("X-") == 0) {
                    List<String> list = entry.getValue();
                    if (list != null && !list.isEmpty()) {
                        extensionHeaderMap.put(entry.getKey(), list.get(0));
                    }
                }
            }

            String token = extensionHeaderMap.get("X-AUTH-TOKEN");

            if (token != null && jwtTokenProvider.validateToken(token)) {
                Authentication auth = jwtTokenProvider.getAuthentication(token);
                SecurityUser securityUser = (SecurityUser) auth.getPrincipal();
                if (securityUser != null) {
                    Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
                    if (sessionAttributes != null) {
                        // 사용자 ID 저장
                        sessionAttributes.put("USER-ID", String.valueOf(securityUser.getId()));
                        sessionAttributes.put("USER-EMAIL", String.valueOf(securityUser.getEmail()));
                        sessionAttributes.put("USER-NAME", String.valueOf(securityUser.getName()));
                        // X-로 시작하는 키를 X-를 제거하고 저장
                        for (Map.Entry<String, String> entry : extensionHeaderMap.entrySet()) {
                            if (!entry.getKey().equals("X-AUTH-TOKEN")) {
                                sessionAttributes.put(entry.getKey().replaceFirst("X-", ""), entry.getValue());
                            }
                        }
                    }
                }
            }
        } else if (StompCommand.SUBSCRIBE.equals(headerAccessor.getCommand())) {
            validateSubscriptionHeader(headerAccessor);
        }
        return message;
    }

    private void validateSubscriptionHeader(StompHeaderAccessor headerAccessor) {
        String userId = (String) headerAccessor.getSessionAttributes().get("USER-ID");
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

        // TESTRUN SUB 권한 검증
    }
}
