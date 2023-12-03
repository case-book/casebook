package com.mindplates.bugcase.framework.handler;

import com.mindplates.bugcase.common.exception.ServiceException;
import java.nio.charset.StandardCharsets;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

@Component
@Slf4j
public class StompErrorHandler extends StompSubProtocolErrorHandler {

    public StompErrorHandler() {
        super();
    }

    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        Throwable exception = new MessageDeliveryException(ex.getMessage());
        if (exception instanceof MessageDeliveryException) {
            return handleUnauthorizedException(clientMessage, exception);
        }

        log.error(ex.getMessage(), ex);
        return super.handleClientMessageProcessingError(clientMessage, ex);
    }

    private Message<byte[]> handleUnauthorizedException(Message<byte[]> clientMessage, Throwable ex) {
        ServiceException apiError = new ServiceException(ex.getMessage());
        return prepareErrorMessage(clientMessage, apiError);
    }

    private Message<byte[]> prepareErrorMessage(Message<byte[]> clientMessage, ServiceException apiError) {
        String message = "ERROR";
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
        accessor.setMessage(message);
        accessor.setLeaveMutable(true);
        return MessageBuilder.createMessage(message.getBytes(StandardCharsets.UTF_8), accessor.getMessageHeaders());
    }
}
