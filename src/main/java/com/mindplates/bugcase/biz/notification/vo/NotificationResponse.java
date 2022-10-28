package com.mindplates.bugcase.biz.notification.vo;


import com.mindplates.bugcase.biz.notification.dto.NotificationDTO;
import com.mindplates.bugcase.common.entity.NotificationTargetCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class NotificationResponse {

  private Long id;
  private NotificationTargetCode target;
  private Long targetId;
  private String message;
  private String url;

  public NotificationResponse(NotificationDTO notification) {
    this.id = notification.getId();
    this.target = notification.getTarget();
    this.targetId = notification.getTargetId();
    this.message = notification.getMessage();
    this.url = notification.getUrl();
  }

}
