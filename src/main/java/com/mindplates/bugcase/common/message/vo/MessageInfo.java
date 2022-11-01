package com.mindplates.bugcase.common.message.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageInfo {

    private Long targetUserId;
    private MessageData data;
    private String topicUrl;

    public String targetTopicUrl() {
        return "/sub/" + topicUrl;
    }


}
