package com.mindplates.bugcase.biz.space.controller;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.space.vo.request.SpaceCreateRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceJoinRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceUpdateRequest;
import com.mindplates.bugcase.biz.space.vo.response.SpaceAccessibleResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceListResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceResponse;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.vo.response.SimpleUserResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    private final MappingUtil mappingUtil;

    @Operation(description = "새 스페이스 추가")
    @PostMapping("")
    public SpaceListResponse createSpaceInfo(@Valid @RequestBody SpaceCreateRequest spaceCreateRequest) {
        SpaceDTO createSpaceInfo = mappingUtil.convert(spaceCreateRequest, SpaceDTO.class);
        SpaceDTO spaceInfo = spaceService.createSpaceInfo(createSpaceInfo, SessionUtil.getUserId());
        return new SpaceListResponse(spaceInfo, null);
    }

    @Operation(description = "스페이스 정보 변경")
    @PutMapping("/{spaceId}")
    public SpaceResponse updateSpaceInfo(@PathVariable Long spaceId, @Valid @RequestBody SpaceUpdateRequest spaceUpdateRequest) {
        if (!spaceId.equals(spaceUpdateRequest.getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }
        SpaceDTO updateSpaceInfo = mappingUtil.convert(spaceUpdateRequest, SpaceDTO.class);
        SpaceDTO spaceInfo = spaceService.updateSpaceInfo(updateSpaceInfo);
        return new SpaceResponse(spaceInfo);
    }

    @Operation(description = "스페이스 검색")
    @GetMapping("")
    public List<SpaceListResponse> selectSpaceList(@RequestParam(value = "query") String query) {
        List<SpaceDTO> spaceList = spaceService.selectSearchAllowedSpaceList(query);
        return spaceList.stream().map(space -> new SpaceListResponse(space, SessionUtil.getUserId())).collect(Collectors.toList());
    }

    @Operation(description = "내 스페이스 목록 조회")
    @GetMapping("/my")
    public List<SpaceListResponse> selectMySpaceList() {
        List<SpaceDTO> spaceList = spaceService.selectUserSpaceList(SessionUtil.getUserId());
        return spaceList.stream().map((space -> {
            Long spaceProjectCount = projectService.selectSpaceProjectCount(space.getId());
            return new SpaceListResponse(space, SessionUtil.getUserId(), spaceProjectCount, space.getUsers().size());
        })).collect(Collectors.toList());
    }

    @Operation(description = "스페이스 정보 조회")
    @GetMapping("/{spaceCode}")
    public SpaceResponse selectSpaceInfo(@PathVariable String spaceCode) {
        SpaceDTO spaceInfo = spaceService.selectSpaceInfo(spaceCode);
        List<Project> spaceProjectList = projectService.selectSpaceProjectList(spaceInfo.getId());
        return new SpaceResponse(spaceInfo, SessionUtil.getUserId(), spaceProjectList);
    }

    @Operation(description = "스페이스 사용자 검색")
    @GetMapping("/{spaceCode}/users")
    public List<SimpleUserResponse> selectSpaceUserList(@PathVariable String spaceCode, @RequestParam(value = "query", required = false) String query) {
        List<SpaceUserDTO> spaceUsers = spaceService.selectSpaceUserList(spaceCode, query);
        return spaceUsers.stream().map(spaceUser -> new SimpleUserResponse(spaceUser.getUser())).collect(Collectors.toList());
    }


    @Operation(description = "스페이스 정보 삭제")
    @DeleteMapping("/{spaceId}")
    public ResponseEntity<?> deleteSpaceInfo(@PathVariable Long spaceId) {
        SpaceDTO spaceInfo = spaceService.selectSpaceInfo(spaceId);
        spaceService.deleteSpaceInfo(spaceInfo);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "스페이스 접근 정보 조회")
    @GetMapping("/{spaceCode}/accessible")
    public SpaceAccessibleResponse selectSpaceAccessibleInfo(@PathVariable String spaceCode) {
        SpaceDTO spaceInfo = spaceService.selectSpaceInfo(spaceCode);
        return new SpaceAccessibleResponse(spaceInfo, SessionUtil.getUserId());
    }

    @Operation(description = "스페이스 참여")
    @PostMapping("/{spaceCode}/applicants")
    public ResponseEntity<?> createSpaceJoinInfo(@PathVariable String spaceCode, @Valid @RequestBody SpaceJoinRequest spaceJoinRequest) {
        SpaceApplicantDTO applicant = SpaceApplicantDTO.builder().user(UserDTO.builder().id(SessionUtil.getUserId()).build()).space(SpaceDTO.builder().code(spaceCode).build()).build();
        applicant.setMessage(spaceJoinRequest.getMessage());
        spaceService.createOrUpdateSpaceApplicantInfo(spaceCode, applicant);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "스페이스 참여 취소")
    @DeleteMapping("/{spaceCode}/applicants")
    public ResponseEntity<?> deleteSpaceJoinInfo(@PathVariable String spaceCode) {
        spaceService.deleteSpaceApplicantInfo(spaceCode, SessionUtil.getUserId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "스페이스 참여 승인")
    @PutMapping("/{spaceCode}/applicants/{applicantId}/approve")
    public ResponseEntity<?> updateSpaceJoinInfoApproval(@PathVariable String spaceCode, @PathVariable Long applicantId) {
        spaceService.updateSpaceApplicantStatus(spaceCode, applicantId, true);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "스페이스 참여 거절")
    @PutMapping("/{spaceCode}/applicants/{applicantId}/reject")
    public ResponseEntity<?> updateSpaceJoinInfoRejection(@PathVariable String spaceCode, @PathVariable Long applicantId) {
        spaceService.updateSpaceApplicantStatus(spaceCode, applicantId, false);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "스페이스 탈퇴")
    @DeleteMapping("/{spaceCode}/users/my")
    public ResponseEntity<?> deleteSpaceUserInfo(@PathVariable String spaceCode) {
        spaceService.deleteSpaceUser(spaceCode, SessionUtil.getUserId());
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
