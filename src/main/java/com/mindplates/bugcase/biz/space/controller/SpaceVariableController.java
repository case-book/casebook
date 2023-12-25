package com.mindplates.bugcase.biz.space.controller;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileVariableDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceVariableDTO;
import com.mindplates.bugcase.biz.space.service.SpaceProfileVariableService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.space.service.SpaceVariableService;
import com.mindplates.bugcase.biz.space.vo.request.SpaceProfileVariableRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceVariableCreateRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceVariableUpdateRequest;
import com.mindplates.bugcase.biz.space.vo.response.SpaceProfileVariableResponse;
import com.mindplates.bugcase.biz.space.vo.response.SpaceVariableResponse;
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
@RequestMapping("/api/spaces/{spaceCode}/variables")
@AllArgsConstructor
public class SpaceVariableController {

    private final SpaceVariableService spaceVariableService;
    private final SpaceService spaceService;
    private final SpaceProfileVariableService spaceProfileVariableService;

    @Operation(description = "스페이스 변수 목록 조회")
    @GetMapping("")
    public List<SpaceVariableResponse> selectSpaceVariableList(@PathVariable String spaceCode) {
        List<SpaceVariableDTO> spaceVariableList = spaceVariableService.selectSpaceVariableList(spaceCode);
        return spaceVariableList
            .stream()
            .map(SpaceVariableResponse::new)
            .collect(Collectors.toList());
    }

    @Operation(description = "새 스페이스 변수 추가")
    @PostMapping("")
    public SpaceVariableResponse createSpaceVariableInfo(@PathVariable String spaceCode,
        @Valid @RequestBody SpaceVariableCreateRequest spaceVariableCreateRequest) {
        long spaceId = spaceService.selectSpaceIdByCode(spaceCode);
        SpaceVariableDTO spaceVariable = spaceVariableCreateRequest.toDTO();
        spaceVariable.setSpace(SpaceDTO.builder().id(spaceId).build());
        SpaceVariableDTO spaceVariableInfo = spaceVariableService.createSpaceVariableInfo(spaceCode, spaceVariable);
        return new SpaceVariableResponse(spaceVariableInfo);
    }

    @Operation(description = "스페이스 변수 정보 변경")
    @PutMapping("/{spaceVariableId}")
    public SpaceVariableResponse updateSpaceVariableInfo(@PathVariable String spaceCode, @PathVariable Long spaceVariableId,
        @Valid @RequestBody SpaceVariableUpdateRequest spaceVariableUpdateRequest) {

        long spaceId = spaceService.selectSpaceIdByCode(spaceCode);
        SpaceVariableDTO spaceVariable = spaceVariableUpdateRequest.toDTO();
        spaceVariable.setId(spaceVariableId);
        spaceVariable.setSpace(SpaceDTO.builder().id(spaceId).build());
        SpaceVariableDTO spaceVariableInfo = spaceVariableService.updateVariableSpaceInfo(spaceCode, spaceVariable);
        return new SpaceVariableResponse(spaceVariableInfo);

    }

    @Operation(description = "스페이스 변수 정보 조회")
    @GetMapping("/{spaceVariableId}")
    public SpaceVariableResponse selectSpaceVariableInfo(@PathVariable String spaceCode, @PathVariable Long spaceVariableId) {
        SpaceVariableDTO spaceVariable = spaceVariableService.selectSpaceVariableInfo(spaceCode, spaceVariableId);
        return new SpaceVariableResponse(spaceVariable);
    }

    @Operation(description = "스페이스 변수 삭제")
    @DeleteMapping("/{spaceVariableId}")
    public ResponseEntity<?> deleteSpaceVariableInfo(@PathVariable String spaceCode, @PathVariable Long spaceVariableId) {
        long spaceId = spaceService.selectSpaceIdByCode(spaceCode);
        spaceVariableService.deleteSpaceVariableInfo(spaceCode, spaceId, spaceVariableId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "스페이스 프로파일 변수 값 변경")
    @PutMapping("/{spaceVariableId}/profiles/{spaceProfileId}")
    public SpaceProfileVariableResponse updateSpaceVariableProfileInfo(@PathVariable String spaceCode, @PathVariable Long spaceVariableId,
        @PathVariable Long spaceProfileId,
        @Valid @RequestBody SpaceProfileVariableRequest spaceProfileVariableRequest) {

        long spaceId = spaceService.selectSpaceIdByCode(spaceCode);
        SpaceProfileVariableDTO spaceProfileVariable = spaceProfileVariableRequest.toDTO();
        spaceProfileVariable.setSpace(SpaceDTO.builder().id(spaceId).code(spaceCode).build());
        spaceProfileVariable.setSpaceVariable(SpaceVariableDTO.builder().id(spaceVariableId).build());
        spaceProfileVariable.setSpaceProfile(SpaceProfileDTO.builder().id(spaceProfileId).build());
        SpaceProfileVariableDTO result = spaceProfileVariableService.createOrUpdateSpaceProfileVariableInfo(spaceCode, spaceProfileVariable);
        return new SpaceProfileVariableResponse(result);
    }

    @Operation(description = "스페이스 프로파일 변수 값 삭제")
    @DeleteMapping("/{spaceVariableId}/profiles/{spaceProfileId}")
    public ResponseEntity<?> deleteSpaceVariableProfileInfo(@PathVariable String spaceCode, @PathVariable Long spaceVariableId,
        @PathVariable Long spaceProfileId) {
        spaceProfileVariableService.deleteSpaceProfileVariableInfo(spaceCode, spaceVariableId, spaceProfileId);
        return new ResponseEntity<>(HttpStatus.OK);

    }


}
