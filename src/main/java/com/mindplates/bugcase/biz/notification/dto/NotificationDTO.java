package com.mindplates.bugcase.biz.notification.dto;

import com.mindplates.bugcase.biz.notification.entity.Notification;
import com.mindplates.bugcase.common.code.NotificationTargetCode;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

  private Long id;
  private NotificationTargetCode target;
  private Long targetId;
  private String message;
  private String url;

  private LocalDateTime creationDate;

  public NotificationDTO(Notification notification) {
    this.id = notification.getId();
    this.target = notification.getTarget();
    this.targetId = notification.getTargetId();
    this.message = notification.getMessage();
    this.url = notification.getUrl();
    this.creationDate = notification.getCreationDate();
  }
}
