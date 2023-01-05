package com.mindplates.bugcase.biz.user.controller;

import com.mindplates.bugcase.biz.notification.dto.NotificationDTO;
import com.mindplates.bugcase.biz.notification.service.NotificationService;
import com.mindplates.bugcase.biz.notification.vo.NotificationInfoResponse;
import com.mindplates.bugcase.biz.notification.vo.NotificationResponse;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
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
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private static final int NOTIFICATION_PAGE_SIZE = 10;
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

        List<SpaceDTO> spaces = spaceService.selectUserSpaceList(result.getId());

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
        List<SpaceDTO> spaces = spaceService.selectUserSpaceList(securityUser.getId());
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
    public NotificationInfoResponse selectUserNotificationList(@RequestParam(value = "pageNo") int pageNo) {
        User user = userService.selectUserInfo(SessionUtil.getUserId());

        if (user == null) {
            throw new ServiceException(HttpStatus.BAD_GATEWAY);
        }

        LocalDateTime currentLastSeen = user.getLastSeen();
        List<NotificationDTO> notifications = notificationService.selectUserNotificationList(SessionUtil.getUserId(), pageNo, NOTIFICATION_PAGE_SIZE);

        if (pageNo == 0) {
            user.setLastSeen(LocalDateTime.now());
            userService.updateUser(user);
        }

        return NotificationInfoResponse.builder()
                .lastSeen(currentLastSeen)
                .hasNext(notifications.size() >= NOTIFICATION_PAGE_SIZE)
                .pageNo(pageNo)
                .notifications(notifications.stream().map(NotificationResponse::new).collect(Collectors.toList()))
                .build();
    }

    @Operation(description = "내 알림 카운트 조회")
    @GetMapping("/my/notifications/count")
    public Long selectUserNotificationCount() {
        User user = userService.selectUserInfo(SessionUtil.getUserId());
        return notificationService.selectUserNotificationCount(SessionUtil.getUserId(), user.getLastSeen(), NOTIFICATION_PAGE_SIZE);
    }

    @Operation(description = "로그인")
    @PostMapping("/login")
    public MyInfoResponse login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) throws NoSuchAlgorithmException {

        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (user == null) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "error.login");
        }

        List<SpaceDTO> spaces = spaceService.selectUserSpaceList(user.getId());
        List<String> roleList = Arrays.asList(user.getSystemRole().toString().split(","));
        return new MyInfoResponse(user, spaces, jwtTokenProvider.createToken(Long.toString(user.getId()), roleList));
    }


    @Operation(description = "로그아웃")
    @DeleteMapping("/logout")
    public MyInfoResponse logout(HttpServletRequest request) {

        return new MyInfoResponse(null, null);
    }


}
