package com.mindplates.bugcase.common.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.common.message.vo.MessageInfo;
import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@AllArgsConstructor
public class MessageBroker {

    private final JsonRedisTemplate<MessageInfo> jsonRedisTemplate;
    private final ObjectMapper mapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void pubMessage(MessageInfo info) {
        jsonRedisTemplate.convertAndSend("sendMessage", info);
    }

    public void sendMessage(String str) throws JsonProcessingException {
        MessageInfo message = mapper.readValue(str, MessageInfo.class);

        if (message.getTargetUserId() == null || "".equals(message.getTargetUserId().toString())) {
            simpMessagingTemplate.convertAndSend(message.targetTopicUrl(), message);
        } else {
            simpMessagingTemplate.convertAndSend(message.targetTopicUrl() + "/users/" + message.getTargetUserId(), message);
        }
    }
}
