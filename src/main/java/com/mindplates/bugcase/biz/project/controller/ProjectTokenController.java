package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import com.mindplates.bugcase.biz.project.service.ProjectTokenService;
import com.mindplates.bugcase.biz.project.vo.request.CreateProjectTokenRequest;
import com.mindplates.bugcase.biz.project.vo.request.UpdateProjectTokenRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectTokenResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
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
@RequestMapping("/api/{spaceCode}/projects/{projectId}/tokens")
@AllArgsConstructor
public class ProjectTokenController {


    private final ProjectTokenService projectTokenService;


    @Operation(description = "프로젝트 토큰 목록")
    @GetMapping("")
    public List<ProjectTokenResponse> selectProjectTokenList(@PathVariable long projectId) {
        List<ProjectTokenDTO> projectTokenList = projectTokenService.selectProjectTokenList(projectId);
        return projectTokenList.stream().map(ProjectTokenResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 토큰 조회")
    @GetMapping("/{tokenId}")
    public ProjectTokenResponse selectProjectTokenInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable Long tokenId) {
        ProjectTokenDTO projectToken = projectTokenService.selectProjectTokenInfo(tokenId);
        return new ProjectTokenResponse(projectToken);
    }

    @Operation(description = "프로젝트 토큰 생성")
    @PostMapping("")
    public ProjectTokenResponse createProjectToken(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody CreateProjectTokenRequest createProjectTokenRequest) {
        ProjectTokenDTO projectToken = projectTokenService.createProjectToken(projectId, createProjectTokenRequest.toDTO(projectId));
        return new ProjectTokenResponse(projectToken);
    }

    @Operation(description = "프로젝트 토큰 변경")
    @PutMapping("/{tokenId}")
    public ProjectTokenResponse updateProjectToken(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable Long tokenId,
        @Valid @RequestBody UpdateProjectTokenRequest updateProjectTokenRequest) {

        ProjectTokenDTO projectToken = projectTokenService.updateProjectToken(updateProjectTokenRequest.toDTO(tokenId, projectId));
        return new ProjectTokenResponse(projectToken);
    }

    @Operation(description = "프로젝트 토큰 삭제")
    @DeleteMapping("/{tokenId}")
    public ResponseEntity<?> deleteProjectToken(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable Long tokenId) {
        ProjectTokenDTO projectToken = projectTokenService.selectProjectTokenInfo(tokenId);
        if (projectId != projectToken.getProject().getId()) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        projectTokenService.deleteProjectToken(tokenId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
