package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.service.ProjectReleaseService;
import com.mindplates.bugcase.biz.project.vo.request.ProjectReleaseCreateRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectReleaseResponse;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/api/{spaceCode}/projects/{projectId}/releases")
@AllArgsConstructor
public class ProjectReleaseController {

    private final ProjectReleaseService projectReleaseService;

    @Operation(description = "프로젝트의 특정 릴리스 조회")
    @GetMapping("/{releaseId}")
    public ProjectReleaseResponse selectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId) {
        ProjectReleaseDTO projectRelease = projectReleaseService.selectProjectRelease(releaseId);
        return new ProjectReleaseResponse(projectRelease, SessionUtil.getUserId(true));
    }

    @Operation(description = "프로젝트의 릴리스 목록 조회")
    @GetMapping("")
    public List<ProjectReleaseResponse> getReleases(@PathVariable String spaceCode, @PathVariable long projectId) {
        List<ProjectReleaseDTO> projectReleaseList = projectReleaseService.selectProjectReleases(spaceCode, projectId);
        return projectReleaseList
            .stream()
            .map(projectReleaseDTO -> new ProjectReleaseResponse(projectReleaseDTO, SessionUtil.getUserId(true)))
            .collect(Collectors.toList());
    }

    @Operation(description = "릴리스 생성")
    @PostMapping("")
    public ProjectReleaseResponse createProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody ProjectReleaseCreateRequest projectReleaseCreateRequest) {
        ProjectReleaseDTO projectRelease = projectReleaseCreateRequest.toDTO(projectId);
        return new ProjectReleaseResponse(projectReleaseService.createProjectRelease(spaceCode, projectId, projectRelease), SessionUtil.getUserId(true));
    }

    @Operation(description = "릴리스 수정")
    @PutMapping("/{releaseId}")
    public ProjectReleaseResponse updateProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId,
        @Valid @RequestBody ProjectReleaseCreateRequest projectReleaseCreateRequest) {
        ProjectReleaseDTO projectRelease = projectReleaseService.updateProjectRelease(spaceCode, projectId, releaseId, projectReleaseCreateRequest.toDTO(projectId));
        return new ProjectReleaseResponse(projectRelease, SessionUtil.getUserId(true));
    }

    @Operation(description = "릴리스 삭제")
    @DeleteMapping("/{releaseId}")
    public void deleteProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId) {
        projectReleaseService.deleteProjectRelease(spaceCode, projectId, releaseId);
    }

}
