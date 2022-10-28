package com.mindplates.bugcase.biz.notification.service;

import com.mindplates.bugcase.biz.notification.dto.NotificationDTO;
import com.mindplates.bugcase.biz.notification.entity.Notification;
import com.mindplates.bugcase.biz.notification.repository.NotificationRepository;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.entity.NotificationTargetCode;
import com.mindplates.bugcase.common.entity.UserRole;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class NotificationService {

  private final NotificationRepository notificationRepository;

  @Transactional
  public Notification saveNotificationInfo(Notification notification) {
    notificationRepository.save(notification);
    return notification;
  }

  @Transactional
  public void createSpaceJoinNotificationInfo(Space space, String message) {

    List<Notification> notifications = new ArrayList();
    space.getUsers().stream().filter((spaceUser -> UserRole.ADMIN.equals(spaceUser.getRole()))).forEach((spaceUser -> {
      notifications.add(Notification.builder()
          .message(message)
          .target(NotificationTargetCode.SPACE)
          .targetId(space.getId())
          .userId(spaceUser.getUser().getId())
          .url("/spaces/" + space.getCode() + "/info")
          .build());
    }));

    notificationRepository.saveAll(notifications);
  }

  @Transactional
  public void createSpaceJoinRequestCancelNotificationInfo(Space space, String userName) {
    this.createSpaceJoinNotificationInfo(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 참여 신청을 취소하였습니다.");
  }

  @Transactional
  public void createSpaceSelfJoinNotificationInfo(Space space, String userName) {
    this.createSpaceJoinNotificationInfo(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 자동 참여하였습니다.");
  }

  @Transactional
  public void createSpaceJoinResultNotificationInfo(Space space, String userName, Long applicantUserId, boolean approval) {
    String status = "거절";
    if (approval) {
      status = "승인";
    }

    this.createSpaceJoinNotificationInfo(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님의 참여 요청이 " + status + " 되었습니다.");

    notificationRepository.save(Notification.builder()
        .message("'" + space.getName() + "'" + " 스페이스 참여 요청이 " + status + " 되었습니다.")
        .target(NotificationTargetCode.SPACE)
        .targetId(space.getId())
        .userId(applicantUserId)
        .url("/spaces/" + space.getCode() + "/info")
        .build());

  }

  @Transactional
  public void createSpaceJoinRequestNotificationInfo(Space space, String userName) {
    this.createSpaceJoinNotificationInfo(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 참여를 요청하였습니다.");
  }

  @Transactional
  public void createSpaceJoinAgainRequestNotificationInfo(Space space, String userName) {
    this.createSpaceJoinNotificationInfo(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 참여를 재요청하였습니다.");
  }

  public List<NotificationDTO> selectUserNotificationList(Long userId) {
    return notificationRepository.findAllByUserId(userId).stream().map((NotificationDTO::new)).collect(Collectors.toList());
  }

}
