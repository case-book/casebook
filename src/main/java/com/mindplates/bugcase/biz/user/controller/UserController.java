package com.mindplates.bugcase.biz.user.controller;

import com.mindplates.bugcase.biz.notification.dto.NotificationDTO;
import com.mindplates.bugcase.biz.notification.service.NotificationService;
import com.mindplates.bugcase.biz.notification.vo.NotificationInfoResponse;
import com.mindplates.bugcase.biz.notification.vo.NotificationResponse;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.user.dto.RefreshTokenDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.dto.UserTokenDTO;
import com.mindplates.bugcase.biz.user.service.RefreshTokenService;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.biz.user.service.UserTokenService;
import com.mindplates.bugcase.biz.user.vo.request.CreateUserTokenRequest;
import com.mindplates.bugcase.biz.user.vo.request.JoinRequest;
import com.mindplates.bugcase.biz.user.vo.request.LoginRequest;
import com.mindplates.bugcase.biz.user.vo.request.UpdateMyInfoRequest;
import com.mindplates.bugcase.biz.user.vo.request.UpdatePasswordRequest;
import com.mindplates.bugcase.biz.user.vo.request.UpdateUserTokenRequest;
import com.mindplates.bugcase.biz.user.vo.response.MyDetailInfoResponse;
import com.mindplates.bugcase.biz.user.vo.response.MyInfoResponse;
import com.mindplates.bugcase.biz.user.vo.response.TokenRefreshResponse;
import com.mindplates.bugcase.biz.user.vo.response.UserTokenResponse;
import com.mindplates.bugcase.common.code.SystemRole;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.service.RedisService;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.SecurityUser;
import com.mindplates.bugcase.framework.security.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private static final int NOTIFICATION_PAGE_SIZE = 10;
    private final UserService userService;
    private final UserTokenService userTokenService;
    private final SpaceService spaceService;
    private final NotificationService notificationService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;
    private final RefreshTokenService refreshTokenService;

    @Operation(description = "회원 가입 및 로그인 처리")
    @PostMapping("/join")
    public MyInfoResponse createUser(@Valid @RequestBody JoinRequest joinRequest) {
        UserDTO userJoinInfo = joinRequest.toDTO();
        UserDTO userInfo = userService.createUser(userJoinInfo, SystemRole.ROLE_USER);
        List<SpaceDTO> spaces = spaceService.selectUserSpaceList(userInfo.getId());
        List<String> roleList = Arrays.asList(userInfo.getSystemRole().toString().split(","));
        return new MyInfoResponse(userInfo, jwtTokenProvider.createToken(Long.toString(userInfo.getId()), roleList), null, spaces);
    }

    @Operation(description = "내 정보 조회")
    @GetMapping("/my")
    public MyInfoResponse selectUserInfo(@AuthenticationPrincipal SecurityUser securityUser) {
        UserDTO user = userService.selectUserInfo(securityUser.getId());
        List<SpaceDTO> spaces = spaceService.selectUserSpaceList(securityUser.getId());
        return new MyInfoResponse(user, null, null, spaces);
    }

    @Operation(description = "내 정보 조회")
    @GetMapping("/my/detail")
    public MyDetailInfoResponse selectMyDetailInfo(@AuthenticationPrincipal SecurityUser securityUser) {
        UserDTO user = userService.selectUserInfo(securityUser.getId());
        List<SpaceDTO> spaces = spaceService.selectUserSpaceList(securityUser.getId());
        return new MyDetailInfoResponse(user, spaces);
    }

    @Operation(description = "내 정보 변경")
    @PutMapping("/my")
    public ResponseEntity<?> updateMyInfo(@Valid @RequestBody UpdateMyInfoRequest updateMyInfoRequest,
        @AuthenticationPrincipal SecurityUser securityUser) {
        userService.updateUser(securityUser.getId(), updateMyInfoRequest.toDTO());

        String[] patterns = {"space*", "project*"};
        redisService.deleteRedisKeys(patterns);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "비밀번호 변경")
    @PutMapping("/my/changePassword")
    public ResponseEntity<?> updateMyPasswordInfo(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest,
        @AuthenticationPrincipal SecurityUser securityUser) {
        if (!updatePasswordRequest.getNextPassword().equals(updatePasswordRequest.getNextPasswordConfirm())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "user.password.confirm.not.matched");
        }
        userService.updateUserPassword(securityUser.getId(), updatePasswordRequest.getCurrentPassword(), updatePasswordRequest.getNextPassword());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "내 알림 정보 조회")
    @GetMapping("/my/notifications")
    public NotificationInfoResponse selectUserNotificationList(@RequestParam(value = "pageNo") int pageNo) {
        UserDTO user = userService.selectUserInfo(SessionUtil.getUserId());
        LocalDateTime currentLastSeen = user.getLastSeen();
        List<NotificationDTO> notifications = notificationService.selectUserNotificationList(SessionUtil.getUserId(), pageNo, NOTIFICATION_PAGE_SIZE);
        if (pageNo == 0) {
            userService.updateUserLastSeen(user.getId(), LocalDateTime.now());
        }
        return NotificationInfoResponse.builder().lastSeen(currentLastSeen).hasNext(notifications.size() >= NOTIFICATION_PAGE_SIZE).pageNo(pageNo)
            .notifications(notifications.stream().map(NotificationResponse::new).collect(Collectors.toList())).build();
    }

    @Operation(description = "내 알림 카운트 조회")
    @GetMapping("/my/notifications/count")
    public Long selectUserNotificationCount() {
        UserDTO user = userService.selectUserInfo(SessionUtil.getUserId());
        return notificationService.selectUserNotificationCount(SessionUtil.getUserId(), user.getLastSeen(), NOTIFICATION_PAGE_SIZE);
    }

    @Operation(description = "로그인 및 초기 데이터 조회")
    @PostMapping("/login")
    public MyInfoResponse login(@Valid @RequestBody LoginRequest loginRequest) throws NoSuchAlgorithmException {
        UserDTO user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (user == null) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "error.login");
        }
        List<SpaceDTO> spaces = spaceService.selectUserSpaceList(user.getId());
        List<String> roleList = Arrays.asList(user.getActiveSystemRole().toString().split(","));
        String refreshToken = Boolean.TRUE.equals(loginRequest.getAutoLogin()) ? refreshTokenService.upsert(user.getId()).getValue() : null;
        return new MyInfoResponse(user, jwtTokenProvider.createToken(Long.toString(user.getId()), roleList), refreshToken, spaces);
    }

    @Operation(description = "Access Token 만료 시 재생성")
    @GetMapping("/refresh")
    public TokenRefreshResponse refreshAccessToken(
        @RequestHeader("X-REFRESH-TOKEN") String refreshToken,
        @RequestHeader("X-AUTH-TOKEN") String accessToken
    ) {
        long userId;
        try {
            userId = Long.parseLong(jwtTokenProvider.getUserIdentifier(accessToken));
        } catch (ExpiredJwtException e) {
            userId = Long.parseLong(e.getClaims().getSubject());
        }
        UserDTO user = userService.selectUserInfo(userId);
        List<String> roleList = Arrays.asList(user.getActiveSystemRole().toString().split(","));
        LocalDateTime currentDateTime = LocalDateTime.now();
        RefreshTokenDTO updatedRefreshToken = refreshTokenService.validateAndUpdateToken(userId, refreshToken, currentDateTime);
        return new TokenRefreshResponse(jwtTokenProvider.createToken(Long.toString(userId), roleList), updatedRefreshToken.getValue());
    }

    @Operation(description = "로그아웃")
    @DeleteMapping("/logout")
    public MyInfoResponse logout(@RequestHeader(value = "X-AUTH-TOKEN", required = false) String accessToken) {
        if (StringUtils.isNotEmpty(accessToken)) {
            try {
                String userId = jwtTokenProvider.getUserIdentifier(accessToken);
                refreshTokenService.invalidateTokenByUserId(Long.parseLong(userId));
            } catch (ExpiredJwtException e) {
                log.info("User {} Requested Logout With Expired Token. Invalidate of Refresh Token did not proceed.", e.getClaims().getSubject());
            }
        }
        return new MyInfoResponse(null, null, null);
    }

    @Operation(description = "사용자 토큰 목록")
    @GetMapping("/my/tokens")
    public List<UserTokenResponse> selectUserTokenList() {
        List<UserTokenDTO> userTokenList = userTokenService.selectUserTokenList(SessionUtil.getUserId());
        return userTokenList.stream().map(UserTokenResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "사용자 토큰 조회")
    @GetMapping("/my/tokens/{tokenId}")
    public UserTokenResponse selectUserTokenInfo(@PathVariable Long tokenId) {
        UserTokenDTO userToken = userTokenService.selectUserTokenInfo(tokenId);
        if (!SessionUtil.getUserId().equals(userToken.getUser().getId())) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED);
        }
        return new UserTokenResponse(userToken);
    }

    @Operation(description = "사용자 토큰 생성")
    @PostMapping("/my/tokens")
    public UserTokenResponse createUserToken(@Valid @RequestBody CreateUserTokenRequest createUserTokenRequest) {
        UserTokenDTO userTokenDTO = createUserTokenRequest.toDTO();
        return new UserTokenResponse(userTokenService.createUserToken(userTokenDTO));
    }

    @Operation(description = "사용자 토큰 변경")
    @PutMapping("/my/tokens/{tokenId}")
    public UserTokenResponse updateUserToken(@PathVariable Long tokenId, @Valid @RequestBody UpdateUserTokenRequest updateUserTokenRequest) {

        UserTokenDTO targetUserToken = userTokenService.selectUserTokenInfo(tokenId);
        if (!SessionUtil.getUserId().equals(targetUserToken.getUser().getId())) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED);
        }

        UserTokenDTO userTokenDTO = updateUserTokenRequest.toDTO();
        return new UserTokenResponse(userTokenService.updateUserToken(tokenId, userTokenDTO));
    }

    @Operation(description = "사용자 토큰 삭제")
    @DeleteMapping("/my/tokens/{tokenId}")
    public ResponseEntity<?> deleteUserToken(@PathVariable Long tokenId) {
        UserTokenDTO userToken = userTokenService.selectUserTokenInfo(tokenId);
        if (!SessionUtil.getUserId().equals(userToken.getUser().getId())) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED);
        }

        userTokenService.deleteUserToken(tokenId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
