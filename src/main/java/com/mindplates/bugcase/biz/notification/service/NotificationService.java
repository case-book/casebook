package com.mindplates.bugcase.biz.notification.service;

import com.mindplates.bugcase.biz.notification.dto.NotificationDTO;
import com.mindplates.bugcase.biz.notification.entity.Notification;
import com.mindplates.bugcase.biz.notification.repository.NotificationRepository;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.common.code.NotificationTargetCode;
import com.mindplates.bugcase.common.code.UserRoleCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.mindplates.bugcase.common.message.MessageSendService;
import com.mindplates.bugcase.common.message.vo.MessageData;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class NotificationService {

  private final NotificationRepository notificationRepository;

  private final UserRepository userRepository;

  private final MessageSendService messageSendService;

  public List<NotificationDTO> selectUserNotificationList(Long userId, int pageNo, int pageSize) {
    Pageable pageInfo = PageRequest.of(pageNo, pageSize, Sort.by("creationDate").descending());
    return notificationRepository.findAllByUserIdOrderByCreationDateDesc(userId, pageInfo).stream().map((NotificationDTO::new)).collect(Collectors.toList());
  }

  public Long selectUserNotificationCount(Long userId, LocalDateTime lastSeen, int pageSize) {
    if (lastSeen == null) {
      return notificationRepository.countByUserId(userId);
    } else {
      Pageable pageInfo = PageRequest.of(0, pageSize, Sort.by("creationDate").descending());
      return Long.parseLong(Integer.toString(notificationRepository.findAllByUserIdAndCreationDateAfterOrderByCreationDateDesc(userId, lastSeen, pageInfo).size()));
    }
  }

  @Transactional
  public void createNotificationInfoToSpaceAdmins(SpaceDTO space, String message) {

    List<Notification> notifications = new ArrayList();
    space.getUsers().stream().filter((spaceUser -> UserRoleCode.ADMIN.equals(spaceUser.getRole()))).forEach((adminUser -> {

      MessageData messageData = MessageData.builder().type("NEW-NOTIFICATION").build();
      messageSendService.sendTo("users/" + adminUser.getUser().getId(), messageData);

      notifications.add(Notification.builder()
          .message(message)
          .target(NotificationTargetCode.SPACE)
          .targetId(space.getId())
          .userId(adminUser.getUser().getId())
          .url("/spaces/" + space.getCode() + "/info")
          .build());
    }));



    notificationRepository.saveAll(notifications);
  }

  @Transactional
  public void createNotificationInfoToUser(NotificationTargetCode targetCode, Long targetId, Long userId, String message, String url) {

    MessageData messageData = MessageData.builder().type("NEW-NOTIFICATION").build();
    messageSendService.sendTo("users/" + userId, messageData);

    notificationRepository.save(Notification.builder()
        .message(message)
        .target(targetCode)
        .targetId(targetId)
        .userId(userId)
        .url(url)
        .build());
  }

  @Transactional
  public void createSpaceJoinRequestCancelNotificationInfo(SpaceDTO space, String userName) {
    this.createNotificationInfoToSpaceAdmins(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 참여 신청을 취소하였습니다.");
  }

  @Transactional
  public void createSpaceSelfJoinNotificationInfo(SpaceDTO space, String userName) {
    this.createNotificationInfoToSpaceAdmins(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 자동 참여하였습니다.");
  }

  @Transactional
  public void createSpaceJoinResultNotificationInfo(SpaceDTO space, String userName, Long applicantUserId, boolean approval) {
    String status = "거절";
    if (approval) {
      status = "승인";
    }

    this.createNotificationInfoToSpaceAdmins(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님의 참여 요청이 " + status + " 되었습니다.");

    MessageData messageData = MessageData.builder().type("NEW-NOTIFICATION").build();
    messageSendService.sendTo("users/" + applicantUserId, messageData);

    notificationRepository.save(Notification.builder()
        .message("'" + space.getName() + "'" + " 스페이스 참여 요청이 " + status + " 되었습니다.")
        .target(NotificationTargetCode.SPACE)
        .targetId(space.getId())
        .userId(applicantUserId)
        .url("/spaces/" + space.getCode() + "/info")
        .build());

  }

  @Transactional
  public void createSpaceJoinRequestNotificationInfo(SpaceDTO space, String userName) {
    this.createNotificationInfoToSpaceAdmins(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 참여를 요청하였습니다.");
  }

  @Transactional
  public void createSpaceJoinAgainRequestNotificationInfo(SpaceDTO space, String userName) {
    this.createNotificationInfoToSpaceAdmins(space, "'" + space.getName() + "'" + " 스페이스에 사용자 '" + userName + "'님이 참여를 재요청하였습니다.");
  }


  @Transactional
  public void createSpaceUserWithdrawInfo(SpaceDTO space, String userInfo) {
    this.createNotificationInfoToSpaceAdmins(space, "'" + space.getName() + "'" + " 스페이스에서 사용자 '" + userInfo + "'님이 탈퇴하였습니다.");
  }


}
