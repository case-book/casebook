package com.mindplates.bugcase.biz.user.controller;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.biz.user.vo.request.JoinRequest;
import com.mindplates.bugcase.biz.user.vo.request.LoginRequest;
import com.mindplates.bugcase.biz.user.vo.response.MyInfoResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.UserSession;
import com.mindplates.bugcase.framework.annotation.DisableLogin;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {
    private final SessionUtil sessionUtil;

    private final UserService userService;

    private final SpaceService spaceService;


    @DisableLogin
    @Operation(description = "회원 가입")
    @PostMapping("/join")
    public MyInfoResponse createUser(@Valid @RequestBody JoinRequest joinRequest, HttpServletRequest request, HttpServletResponse response) {

        User user = joinRequest.buildEntity();
        checkUserValidation(user, null);
        User result = userService.createUser(user);
        sessionUtil.login(request, result);
        List<Space> spaces = spaceService.selectUserSpaceList(sessionUtil.getUserId(request));

        return new MyInfoResponse(result, spaces, sessionUtil.getUserToken(request));
    }


    @DisableLogin
    @Operation(description = "내 정보 조회")
    @GetMapping("/my")
    public MyInfoResponse selectUserInfo(HttpServletRequest request) {

        if (sessionUtil.isLogin(request)) {
            UserSession userSession = sessionUtil.getUserInfo(request);
            User user = userService.selectUserInfo(userSession.getId());
            List<Space> spaces = spaceService.selectUserSpaceList(sessionUtil.getUserId(request));
            return new MyInfoResponse(user, spaces, userSession.getToken());
        } else {
            sessionUtil.login(request);
            UserSession userSession = sessionUtil.getUserInfo(request);
            return new MyInfoResponse(null, userSession.getToken());
        }
    }

    private void checkUserValidation(User user, Long currentUserId) {
        boolean existEmailUser = userService.existUserByEmail(user.getEmail(), currentUserId);
        if (existEmailUser) {
            throw new ServiceException("error.existEmail");
        }
    }


    @DisableLogin
    @Operation(description = "로그인")
    @PostMapping("/login")
    public MyInfoResponse login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) throws NoSuchAlgorithmException {

        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (user == null) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "error.login");
        }
        sessionUtil.login(request, user);
        List<Space> spaces = spaceService.selectUserSpaceList(sessionUtil.getUserId(request));
        return new MyInfoResponse(user, spaces, sessionUtil.getUserToken(request));
    }

    @DisableLogin
    @Operation(description = "로그아웃")
    @DeleteMapping("/logout")
    public MyInfoResponse logout(HttpServletRequest request) {
        UserSession userSession = sessionUtil.logout(request);
        return new MyInfoResponse(null, userSession.getToken());
    }


}
