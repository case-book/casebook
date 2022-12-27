package com.mindplates.bugcase.biz.notification.dto;

import com.mindplates.bugcase.biz.notification.entity.Notification;
import com.mindplates.bugcase.common.code.NotificationTargetCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class NotificationDTO extends CommonDTO {

  private Long id;
  private NotificationTargetCode target;
  private Long targetId;
  private Long userId;
  private String message;
  private String url;


  public NotificationDTO(Notification notification) {
    this.id = notification.getId();
    this.target = notification.getTarget();
    this.targetId = notification.getTargetId();
    this.message = notification.getMessage();
    this.url = notification.getUrl();
    this.creationDate = notification.getCreationDate();
  }
}
