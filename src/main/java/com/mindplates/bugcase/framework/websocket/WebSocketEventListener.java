package com.mindplates.bugcase.framework.websocket;

import com.mindplates.bugcase.biz.testrun.dto.TestrunParticipantDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.common.message.MessageSendService;
import com.mindplates.bugcase.common.message.vo.MessageData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class WebSocketEventListener {

    private final TestrunService testrunService;

    private final MessageSendService messageSendService;

    public WebSocketEventListener(TestrunService testrunService, MessageSendService messageSendService) {
        this.testrunService = testrunService;
        this.messageSendService = messageSendService;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Map<String, Object> attributes = headerAccessor.getSessionAttributes();
        if (attributes != null) {
            Long userId = Long.parseLong((String) attributes.get("USER-ID"));
            String workCode = (String) attributes.get("WORK-CODE");
            if (workCode != null && workCode.equals("TESTRUN-SYNC")) {
                Long testrunId = Long.parseLong((String) attributes.get("TESTRUN-ID"));
                List<TestrunParticipantDTO> participants = testrunService.selectTestrunParticipantList(testrunId, userId);

                Optional<TestrunParticipantDTO> currentParticipant = participants.stream().filter((testrunParticipantDTO -> testrunParticipantDTO.getUserId().equals(userId))).findFirst();
                if (currentParticipant.isPresent()) {
                    testrunService.deleteTestrunParticipantInfo(currentParticipant.get());
                }
                participants.forEach((participant) -> {

                    MessageData participantData = MessageData.builder().type("TESTRUN-USER-LEAVE").build();
                    participantData.addData("participant", participant);
                    messageSendService.sendTo("projects/" + participant.getProjectId() + "/testruns/" + participant.getTestrunId(), participantData);
                });

            }
        }
    }
}
