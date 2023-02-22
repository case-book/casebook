package com.mindplates.bugcase.biz.admin.controller;

import com.mindplates.bugcase.biz.admin.vo.request.UpdatePasswordRequest;
import com.mindplates.bugcase.biz.admin.vo.request.UserUpdateRequest;
import com.mindplates.bugcase.biz.admin.vo.response.SystemInfoResponse;
import com.mindplates.bugcase.biz.admin.vo.response.UserDetailResponse;
import com.mindplates.bugcase.biz.admin.vo.response.UserListResponse;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.space.vo.response.SpaceListResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceResponse;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final JsonRedisTemplate jsonRedisTemplate;

    private final UserService userService;

    private final SpaceService spaceService;

    private final ProjectService projectService;

    @Operation(description = "모든 스페이스 조회")
    @GetMapping("/spaces")
    public List<SpaceListResponse> selectSpaceList() {
        List<SpaceDTO> spaces = spaceService.selectSpaceList();
        return spaces.stream().map(SpaceListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "스페이스 조회")
    @GetMapping("/spaces/{spaceId}")
    public SpaceResponse selectSpaceInfo(@PathVariable Long spaceId) {
        SpaceDTO space = spaceService.selectSpaceInfo(spaceId);
        List<ProjectDTO> spaceProjectList = projectService.selectSpaceProjectList(spaceId);
        return new SpaceResponse(space, spaceProjectList);
    }

    @Operation(description = "모든 사용자 조회")
    @GetMapping("/users")
    public List<UserListResponse> selectUserList() {
        List<UserDTO> users = userService.selectUserList();
        return users.stream().map((userDTO -> {
            List<SpaceDTO> userSpaceList = spaceService.selectUserSpaceList(userDTO.getId());
            return new UserListResponse(userDTO, userSpaceList);
        })).collect(Collectors.toList());
    }

    @Operation(description = "사용자 조회")
    @GetMapping("/users/{userId}")
    public UserDetailResponse selectUserInfo(@PathVariable Long userId) {
        UserDTO user = userService.selectUserInfo(userId);
        List<SpaceDTO> userSpaceList = spaceService.selectUserSpaceList(user.getId());
        return new UserDetailResponse(user, userSpaceList);
    }

    @Operation(description = "사용자 정보 변경")
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUserPasswordInfo(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        userService.updateUserByAdmin(userId, userUpdateRequest.toDTO());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "사용자 비밀번호 변경")
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<?> updateUserInfo(@PathVariable Long userId, @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        if (!updatePasswordRequest.getNextPassword().equals(updatePasswordRequest.getNextPasswordConfirm())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "user.password.confirm.not.matched");
        }
        userService.updateUserPasswordByAdmin(userId, updatePasswordRequest.getNextPassword());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "시스템 정보 조회")
    @GetMapping("/system/info")
    public SystemInfoResponse selectSystemInfo() {
        AtomicReference<Properties> keyspace = new AtomicReference<>();
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            keyspace.set(connection.info("keyspace"));
            return null;
        });

        AtomicReference<Properties> memory = new AtomicReference<>();
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            memory.set(connection.info("memory"));
            return null;
        });

        Map<String, String> redis = new HashMap<>();

        Properties keyspaceProperties = keyspace.get();
        getInfo(redis, keyspaceProperties);

        Properties memoryProperties = memory.get();
        getInfo(redis, memoryProperties);

        Map<String, String> system = new HashMap<>();
        Properties properties = System.getProperties();
        getInfo(system, properties);


        return new SystemInfoResponse(redis, system);
    }


    @Operation(description = "레디스 데이터 초기화")
    @DeleteMapping("/system/caches/flush")
    public ResponseEntity<?> flushRedis() {
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            connection.flushAll();
            return null;
        });

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "레디스 데이터 초기화")
    @DeleteMapping("/system/caches/delete")
    public ResponseEntity<?> deleteRedis() {

        String[] patterns = {"space*", "project*"};

        for (String pattern : patterns) {
            Set<String> keys = jsonRedisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                jsonRedisTemplate.delete(keys);
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void getInfo(Map<String, String> info, Properties memoryProperties) {
        Enumeration<String> memoryEnums = (Enumeration<String>) memoryProperties.propertyNames();
        while (memoryEnums.hasMoreElements()) {
            String key = memoryEnums.nextElement();
            String value = memoryProperties.getProperty(key);
            info.put(key, value);
        }
    }

}
