package com.mindplates.bugcase.biz.space.controller;

import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.space.vo.request.SpaceRequest;
import com.mindplates.bugcase.biz.space.vo.response.SimpleSpaceResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceResponse;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.biz.user.vo.response.SimpleUserResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.annotation.DisableLogin;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/spaces")
@AllArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    private final ProjectService projectService;

    private final UserService userService;

    private final SessionUtil sessionUtil;

    @Operation(description = "스페이스 추가")
    @PostMapping("")
    public SimpleSpaceResponse createSpace(@Valid @RequestBody SpaceRequest spaceRequest, HttpServletRequest request) {
        Space space = spaceRequest.buildEntity();
        Space result = spaceService.createSpaceInfo(space, sessionUtil.getUserId(request));
        return new SimpleSpaceResponse(result);
    }

    @DisableLogin
    @Operation(description = "스페이스 목록 조회")
    @GetMapping("")
    public List<SimpleSpaceResponse> selectSpaceList() {
        List<Space> spaces = spaceService.selectSpaceList();
        return spaces.stream().map(SimpleSpaceResponse::new).collect(Collectors.toList());
    }


    @Operation(description = "내 스페이스 목록 조회")
    @GetMapping("/my")
    public List<SpaceResponse> selectMySpaceList(HttpServletRequest request) {
        List<Space> spaces = spaceService.selectUserSpaceList(sessionUtil.getUserId(request));

        return spaces.stream().map((space -> {
            Long spaceCount = projectService.selectSpaceProjectCount(space.getId());
            return new SpaceResponse(space, spaceCount);
        })).collect(Collectors.toList());
    }

    @Operation(description = "스페이스 정보 조회")
    @GetMapping("/{spaceCode}")
    public SpaceResponse selectSpaceInfo(@PathVariable String spaceCode) {
        Space space = spaceService.selectSpaceInfo(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceResponse(space);
    }

    @Operation(description = "스페이스 변경")
    @PutMapping("/{spaceId}")
    public SpaceResponse updateSpace(@PathVariable Long spaceId, @Valid @RequestBody SpaceRequest spaceRequest) {

        Space space = spaceService.selectSpaceInfo(spaceId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        space.setName(spaceRequest.getName());
        space.setCode(spaceRequest.getCode().toUpperCase());
        space.setDescription(spaceRequest.getDescription());
        space.setActivated(spaceRequest.getActivated());
        space.setToken(spaceRequest.getToken());

        Space result = spaceService.updateSpaceInfo(space, 0L);
        return new SpaceResponse(result);
    }


    @Operation(description = "스페이스 정보 삭제")
    @DeleteMapping("/{spaceId}")
    public ResponseEntity<?> deleteSpaceInfo(@PathVariable Long spaceId) {
        spaceService.deleteSpaceInfo(spaceId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "스페이스 사용자 검색")
    @GetMapping("/{spaceCode}/users")
    public List<SimpleUserResponse> selectSpaceSpaceUserList(@PathVariable String spaceCode, @RequestParam(value = "query", required = false) String query) {

        List<SpaceUser> spaceUsers = spaceService.selectSpaceUserList(spaceCode, query);
        return spaceUsers.stream().map(spaceUser -> new SimpleUserResponse(spaceUser.getUser())).collect(Collectors.toList());

    }

}
