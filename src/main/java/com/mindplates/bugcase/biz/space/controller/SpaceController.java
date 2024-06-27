package com.mindplates.bugcase.biz.space.controller;

import com.mindplates.bugcase.biz.ai.vo.response.LlmResponse;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.space.vo.request.HolidayRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceCreateRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceJoinRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceUpdateRequest;
import com.mindplates.bugcase.biz.space.vo.response.SpaceAccessibleResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceListResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceMessageChannelResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceResponse;
import com.mindplates.bugcase.biz.user.vo.response.SimpleUserResponse;
import com.mindplates.bugcase.common.code.HolidayTypeCode;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/spaces")
@AllArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;
    private final ProjectService projectService;

    @Operation(description = "스페이스 검색")
    @GetMapping("")
    public List<SpaceListResponse> selectSpaceList(@RequestParam(value = "query") String query) {
        List<SpaceDTO> spaceList = spaceService.selectSearchAllowedSpaceList(query, SessionUtil.getUserId());
        return spaceList.stream().map(SpaceListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "내 스페이스 목록 조회")
    @GetMapping("/my")
    public List<SpaceListResponse> selectMySpaceList(@RequestParam(value = "query", required = false) String query) {
        List<SpaceDTO> spaceList = spaceService.selectUserSpaceList(SessionUtil.getUserId(), query);
        return spaceList.stream().map((SpaceListResponse::new)).collect(Collectors.toList());
    }

    @Operation(description = "새 스페이스 추가")
    @PostMapping("")
    public SpaceResponse createSpaceInfo(@Valid @RequestBody SpaceCreateRequest spaceCreateRequest) {
        checkValidHoliday(spaceCreateRequest.getHolidays());
        SpaceDTO spaceInfo = spaceService.createSpaceInfo(spaceCreateRequest.toDTO(), SessionUtil.getUserId());
        return new SpaceResponse(spaceInfo);
    }


    @Operation(description = "스페이스 정보 변경")
    @PutMapping("/{spaceId}")
    public SpaceResponse updateSpaceInfo(@PathVariable Long spaceId, @Valid @RequestBody SpaceUpdateRequest spaceUpdateRequest) {
        if (!spaceId.equals(spaceUpdateRequest.getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        checkValidHoliday(spaceUpdateRequest.getHolidays());
        String spaceCode = spaceService.selectSpaceCode(spaceId);
        SpaceDTO spaceInfo = spaceService.updateSpaceInfo(spaceUpdateRequest.toDTO(spaceCode));
        return new SpaceResponse(spaceInfo);
    }

    @Operation(description = "스페이스 정보 조회")
    @GetMapping("/{spaceCode}")
    public SpaceResponse selectSpaceInfo(@PathVariable String spaceCode) {
        SpaceDTO spaceInfo = spaceService.selectSpaceInfo(spaceCode);

        Long userId = SessionUtil.getUserId();

        List<ProjectDTO> spaceProjectList;
        if (userId != null && spaceInfo.getUsers().stream().anyMatch(spaceUser -> spaceUser.getUser().getId().equals(userId) && UserRoleCode.ADMIN.equals(spaceUser.getRole()))) {
            spaceProjectList = projectService.selectSpaceProjectList(spaceInfo.getId());
        } else {
            spaceProjectList = projectService.selectSpaceMyProjectList(spaceInfo.getCode(), userId);
        }

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
        SpaceApplicantDTO applicant = spaceJoinRequest.toDTO(spaceCode, SessionUtil.getUserId());
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

    @Operation(description = "스페이스 메세지 채널 조회")
    @GetMapping("/{spaceCode}/channels")
    public List<SpaceMessageChannelResponse> selectSpaceMessageChannels(@PathVariable String spaceCode) {
        List<SpaceMessageChannelDTO> spaceMessageChannels = spaceService.selectSpaceMessageChannels(spaceCode);
        return spaceMessageChannels.stream().map(SpaceMessageChannelResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "스페이스 LLM 목록 조회")
    @GetMapping("/{spaceCode}/llms")
    public List<LlmResponse> selectSpaceLlms(@PathVariable String spaceCode) {
        SpaceDTO spaceInfo = spaceService.selectSpaceInfo(spaceCode);
        return spaceInfo.getLlms().stream().map(llmDTO -> new LlmResponse(llmDTO, true)).collect(Collectors.toList());
    }

    private void checkValidHoliday(List<HolidayRequest> holidays) {

        if (holidays == null) {
            return;
        }

        try {
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

            for (HolidayRequest holiday : holidays) {
                if (HolidayTypeCode.YEARLY.equals(holiday.getHolidayType())) {
                    LocalDate.parse(now.format(DateTimeFormatter.ofPattern("yyyy")) + holiday.getDate(), formatter);
                } else if (HolidayTypeCode.SPECIFIED_DATE.equals(holiday.getHolidayType())) {
                    LocalDate.parse(holiday.getDate(), formatter);
                }
            }
        } catch (Exception e) {
            throw new ServiceException("holiday.format.invalid");
        }
    }


}
