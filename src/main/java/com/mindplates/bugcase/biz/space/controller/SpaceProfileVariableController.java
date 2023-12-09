package com.mindplates.bugcase.biz.space.controller;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileVariableDTO;
import com.mindplates.bugcase.biz.space.service.SpaceProfileService;
import com.mindplates.bugcase.biz.space.service.SpaceProfileVariableService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.space.vo.response.SpaceProfileVariableResponse;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/spaces/{spaceCode}/profiles-variables")
@AllArgsConstructor
public class SpaceProfileVariableController {

    private final SpaceProfileService spaceProfileService;
    private final SpaceProfileVariableService spaceProfileVariableService;
    private final SpaceService spaceService;

    @Operation(description = "스페이스 프로파일 변수 목록 조회")
    @GetMapping("")
    public List<SpaceProfileVariableResponse> selectSpaceProfileVariableList(@PathVariable String spaceCode) {
        List<SpaceProfileVariableDTO> spaceProfileVariableList = spaceProfileVariableService.selectSpaceProfileVariableList(spaceCode);
        return spaceProfileVariableList
            .stream()
            .map(SpaceProfileVariableResponse::new)
            .collect(Collectors.toList());
    }


}
