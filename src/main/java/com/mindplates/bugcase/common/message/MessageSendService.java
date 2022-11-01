package com.mindplates.bugcase.common.message;

import com.mindplates.bugcase.common.message.vo.MessageData;
import com.mindplates.bugcase.common.message.vo.MessageInfo;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

@Log
@Service
@AllArgsConstructor
public class MessageSendService {

    final private MessageBroker messageBroker;

    public void sendTo(String topic, MessageData messageData) {
        try {
            messageBroker.pubMessage(MessageInfo.builder()
                    .topicUrl(topic)
                    .data(messageData)
                    .build());
        } catch (Exception e) {
            // ignore
        }

    }

    public void sendToUser(String topic, Long targetUserId, MessageData messageData) {
        try {
            messageBroker.pubMessage(MessageInfo.builder()
                    .topicUrl(topic)
                    .targetUserId(targetUserId)
                    .data(messageData)
                    .build());
        } catch (Exception e) {
            // ignore
        }

    }


}
