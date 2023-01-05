package com.mindplates.bugcase.biz.notification.vo;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class NotificationInfoResponse {

    private LocalDateTime lastSeen;
    private int pageNo;
    private boolean hasNext;
    private List<NotificationResponse> notifications;

}
