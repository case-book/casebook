package com.mindplates.bugcase.framework.websocket;

import com.mindplates.bugcase.biz.testrun.dto.TestrunParticipantDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunParticipantService;
import com.mindplates.bugcase.common.message.MessageSendService;
import com.mindplates.bugcase.common.message.vo.MessageData;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
public class WebSocketEventListener {

    private final TestrunParticipantService testrunParticipantService;
    private final MessageSendService messageSendService;

    public WebSocketEventListener(TestrunParticipantService testrunParticipantService, MessageSendService messageSendService) {
        this.testrunParticipantService = testrunParticipantService;
        this.messageSendService = messageSendService;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Map<String, Object> attributes = headerAccessor.getSessionAttributes();
        if (attributes != null) {
            String userIdString = (String) attributes.get("USER-ID");
            String sessionId = headerAccessor.getSessionId();
            if (userIdString != null) {
                Long userId = Long.parseLong(userIdString);
                List<TestrunParticipantDTO> participants = testrunParticipantService.selectTestrunParticipantList(userId, sessionId);

                for (TestrunParticipantDTO participant : participants) {
                    testrunParticipantService.deleteTestrunParticipantInfo(participant);
                    boolean isExist = testrunParticipantService.isExistParticipant(participant.getTestrunId(), participant.getUserId());
                    if (!isExist) {
                        MessageData participantData = MessageData.builder().type("TESTRUN-USER-LEAVE").build();
                        participantData.addData("participant", participant);
                        messageSendService.sendTo("projects/" + participant.getProjectId() + "/testruns/" + participant.getTestrunId(), participantData);
                    }
                }
            }

        }
    }
}
