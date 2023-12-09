package com.mindplates.bugcase.biz.space.controller;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.space.service.SpaceProfileService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.space.vo.request.SpaceProfileCreateRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceProfileUpdateRequest;
import com.mindplates.bugcase.biz.space.vo.response.SpaceProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/spaces/{spaceCode}/profiles")
@AllArgsConstructor
public class SpaceProfileController {

    private final SpaceProfileService spaceProfileService;
    private final SpaceService spaceService;

    @Operation(description = "스페이스 프로파일 목록 조회")
    @GetMapping("")
    public List<SpaceProfileResponse> selectSpaceProfileList(@PathVariable String spaceCode) {
        List<SpaceProfileDTO> spaceProfileList = spaceProfileService.selectSpaceProfileList(spaceCode);
        return spaceProfileList
            .stream()
            .map(SpaceProfileResponse::new)
            .collect(Collectors.toList());
    }

    @Operation(description = "새 스페이스 프로파일 추가")
    @PostMapping("")
    public SpaceProfileResponse createSpaceProfileInfo(@PathVariable String spaceCode,
        @Valid @RequestBody SpaceProfileCreateRequest spaceProfileCreateRequest) {
        long spaceId = spaceService.selectSpaceIdByCode(spaceCode);
        SpaceProfileDTO spaceProfile = spaceProfileCreateRequest.toDTO();
        spaceProfile.setSpace(SpaceDTO.builder().id(spaceId).build());
        SpaceProfileDTO spaceProfileInfo = spaceProfileService.createSpaceProfileInfo(spaceProfile);
        return new SpaceProfileResponse(spaceProfileInfo);
    }

    @Operation(description = "스페이스 프로파일 정보 변경")
    @PutMapping("/{spaceProfileId}")
    public SpaceProfileResponse updateSpaceProfileInfo(@PathVariable String spaceCode, @PathVariable Long spaceProfileId,
        @Valid @RequestBody SpaceProfileUpdateRequest spaceProfileUpdateRequest) {

        long spaceId = spaceService.selectSpaceIdByCode(spaceCode);
        SpaceProfileDTO spaceProfile = spaceProfileUpdateRequest.toDTO();
        spaceProfile.setId(spaceProfileId);
        spaceProfile.setSpace(SpaceDTO.builder().id(spaceId).build());
        SpaceProfileDTO spaceProfileInfo = spaceProfileService.updateProfileSpaceInfo(spaceProfile);
        return new SpaceProfileResponse(spaceProfileInfo);

    }

    @Operation(description = "스페이스 프로파일 정보 조회")
    @GetMapping("/{spaceProfileId}")
    public SpaceProfileResponse selectSpaceProfileInfo(@PathVariable String spaceCode, @PathVariable Long spaceProfileId) {
        SpaceProfileDTO spaceProfile = spaceProfileService.selectSpaceProfileInfo(spaceCode, spaceProfileId);
        return new SpaceProfileResponse(spaceProfile);
    }

    @Operation(description = "스페이스 프로파일 삭제")
    @DeleteMapping("/{spaceProfileId}")
    public ResponseEntity<?> deleteSpaceProfileInfo(@PathVariable String spaceCode, @PathVariable Long spaceProfileId) {
        long spaceId = -spaceService.selectSpaceIdByCode(spaceCode);
        spaceProfileService.deleteSpaceProfileInfo(spaceId, spaceProfileId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
