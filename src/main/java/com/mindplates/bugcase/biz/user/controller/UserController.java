package com.mindplates.bugcase.biz.user.controller;

import com.mindplates.bugcase.biz.notification.dto.NotificationDTO;
import com.mindplates.bugcase.biz.notification.service.NotificationService;
import com.mindplates.bugcase.biz.notification.vo.NotificationResponse;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.biz.user.vo.request.JoinRequest;
import com.mindplates.bugcase.biz.user.vo.request.LoginRequest;
import com.mindplates.bugcase.biz.user.vo.response.MyInfoResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.SecurityUser;
import com.mindplates.bugcase.framework.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

  private final SessionUtil sessionUtil;

  private final UserService userService;

  private final SpaceService spaceService;

  private final NotificationService notificationService;

  private final JwtTokenProvider jwtTokenProvider;


  @Operation(description = "회원 가입")
  @PostMapping("/join")
  public MyInfoResponse createUser(@Valid @RequestBody JoinRequest joinRequest, HttpServletRequest request, HttpServletResponse response) {

    User user = joinRequest.buildEntity();
    checkUserValidation(user, null);
    User result = userService.createUser(user);

    List<Space> spaces = spaceService.selectUserSpaceList(result.getId());

    List<String> roleList = Arrays.asList(user.getSystemRole().toString().split(","));
    return new MyInfoResponse(result, spaces, jwtTokenProvider.createToken(Long.toString(result.getId()), roleList));
  }


  @Operation(description = "내 정보 조회")
  @GetMapping("/my")
  public MyInfoResponse selectUserInfo(@AuthenticationPrincipal SecurityUser securityUser, HttpServletRequest request) {
    if (securityUser == null) {
      throw new ServiceException(HttpStatus.UNAUTHORIZED);
    }
    User user = userService.selectUserInfo(securityUser.getId());
    List<Space> spaces = spaceService.selectUserSpaceList(securityUser.getId());
    return new MyInfoResponse(user, spaces, null);
  }

  private void checkUserValidation(User user, Long currentUserId) {
    boolean existEmailUser = userService.existUserByEmail(user.getEmail(), currentUserId);
    if (existEmailUser) {
      throw new ServiceException("error.existEmail");
    }
  }

  @Operation(description = "내 알림 정보 조회")
  @GetMapping("/my/notifications")
  public List<NotificationResponse> selectUserNotificationList() {
    List<NotificationDTO> notifications = notificationService.selectUserNotificationList(SessionUtil.getUserId());
    return notifications.stream().map(NotificationResponse::new).collect(Collectors.toList());
  }

  @Operation(description = "내 알림 정보 조회")
  @GetMapping("/my/notifications/count")
  public Long selectUserNotificationCount() {
    Long count = notificationService.selectUserNotificationCount(SessionUtil.getUserId());
    return count;
  }

  @Operation(description = "로그인")
  @PostMapping("/login")
  public MyInfoResponse login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) throws NoSuchAlgorithmException {

    User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
    if (user == null) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, "error.login");
    }

    // sessionUtil.login(request, user);
    List<Space> spaces = spaceService.selectUserSpaceList(user.getId());
    List<String> roleList = Arrays.asList(user.getSystemRole().toString().split(","));
    return new MyInfoResponse(user, spaces, jwtTokenProvider.createToken(Long.toString(user.getId()), roleList));
  }


  @Operation(description = "로그아웃")
  @DeleteMapping("/logout")
  public MyInfoResponse logout(HttpServletRequest request) {

    return new MyInfoResponse(null, null);
  }


}
