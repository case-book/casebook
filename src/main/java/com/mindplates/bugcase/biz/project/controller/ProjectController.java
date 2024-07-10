package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectListDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.service.ProjectReleaseService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.project.service.ProjectTokenService;
import com.mindplates.bugcase.biz.project.vo.request.ProjectCreateRequest;
import com.mindplates.bugcase.biz.project.vo.request.ProjectReleaseCreateRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectMessageChannelResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectReleaseResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects")
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    private final ProjectTokenService projectTokenService;

    private final ProjectFileService projectFileService;

    private final ProjectReleaseService projectReleaseService;

    private final FileUtil fileUtil;

    @Operation(description = "프로젝트 생성")
    @PostMapping("")
    public ProjectResponse createProjectInfo(@PathVariable String spaceCode, @Valid @RequestBody ProjectCreateRequest projectCreateRequest) {
        ProjectDTO project = projectService.createProjectInfo(spaceCode, projectCreateRequest.toDTO(), SessionUtil.getUserId());
        return new ProjectResponse(project, SessionUtil.getUserId());
    }

    @Operation(description = "프로젝트 조회")
    @GetMapping("/{projectId}")
    public ProjectResponse selectProjectInfo(@PathVariable String spaceCode, @PathVariable long projectId) {
        ProjectDTO project = projectService.selectProjectInfo(spaceCode, projectId);
        return new ProjectResponse(project, SessionUtil.getUserId());
    }

    @Operation(description = "스페이스 프로젝트 목록 조회")
    @GetMapping("/my")
    public List<ProjectListResponse> selectSpaceMyProjectList(@PathVariable String spaceCode) {
        List<ProjectListDTO> projectList = projectService.selectSpaceMyProjectList(spaceCode, SessionUtil.getUserId());
        return projectList.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 수정")
    @PutMapping("/{projectId}")
    public ProjectResponse updateProjectInfo(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody ProjectCreateRequest projectUpdateRequest) {

        if (projectId != projectUpdateRequest.getId()) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        ProjectDTO project = projectService.updateProjectInfo(spaceCode, projectUpdateRequest.toDTO(), projectUpdateRequest.getTargetReleaseId());
        return new ProjectResponse(project, SessionUtil.getUserId());
    }


    @Operation(description = "프로젝트 삭제")
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProjectInfo(@PathVariable String spaceCode, @PathVariable long projectId) {
        ProjectDTO project = projectService.selectProjectInfo(spaceCode, projectId);
        projectService.deleteProjectInfo(spaceCode, project);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "프로젝트 이름 조회")
    @GetMapping("/{projectId}/name")
    public ProjectResponse selectProjectName(@PathVariable String spaceCode, @PathVariable long projectId) {
        String projectName = projectService.selectProjectName(spaceCode, projectId);
        return ProjectResponse.builder().name(projectName).build();
    }


    @Operation(description = "프로젝트 탈퇴")
    @DeleteMapping("/{projectId}/users/my")
    public ResponseEntity<?> deleteProjectUserInfo(@PathVariable String spaceCode, @PathVariable long projectId) {
        projectService.deleteProjectUser(spaceCode, projectId, SessionUtil.getUserId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "프로젝트의 특정 릴리스 조회")
    @GetMapping("/{projectId}/releases/{releaseId}")
    public ProjectReleaseResponse selectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId) {
        ProjectReleaseDTO projectRelease = projectReleaseService.selectProjectRelease(releaseId);
        return new ProjectReleaseResponse(projectRelease, SessionUtil.getUserId(true));
    }

    @Operation(description = "프로젝트의 릴리스 목록 조회")
    @GetMapping("/{projectId}/releases")
    public List<ProjectReleaseResponse> getReleases(@PathVariable String spaceCode, @PathVariable long projectId) {
        List<ProjectReleaseDTO> projectReleaseList = projectReleaseService.selectProjectReleases(spaceCode, projectId);
        return projectReleaseList
            .stream()
            .map(projectReleaseDTO -> new ProjectReleaseResponse(projectReleaseDTO, SessionUtil.getUserId(true)))
            .collect(Collectors.toList());
    }

    @Operation(description = "릴리스 생성")
    @PostMapping("/{projectId}/releases")
    public ProjectReleaseResponse createProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody ProjectReleaseCreateRequest projectReleaseCreateRequest) {
        ProjectReleaseDTO projectRelease = projectReleaseCreateRequest.toDTO(projectId);
        return new ProjectReleaseResponse(projectReleaseService.createProjectRelease(spaceCode, projectId, projectRelease), SessionUtil.getUserId(true));
    }

    @Operation(description = "릴리스 수정")
    @PutMapping("/{projectId}/releases/{releaseId}")
    public ProjectReleaseResponse updateProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId,
        @Valid @RequestBody ProjectReleaseCreateRequest projectReleaseCreateRequest) {
        ProjectReleaseDTO projectRelease = projectReleaseService.updateProjectRelease(spaceCode, projectId, releaseId, projectReleaseCreateRequest.toDTO(projectId));
        return new ProjectReleaseResponse(projectRelease, SessionUtil.getUserId(true));
    }

    @Operation(description = "릴리스 삭제")
    @DeleteMapping("/{projectId}/releases/{releaseId}")
    public void deleteProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId) {
        projectReleaseService.deleteProjectRelease(spaceCode, projectId, releaseId);
    }

    @Operation(description = "프로젝트 메세지 채널 조회")
    @GetMapping("/{projectId}/channels")
    public List<ProjectMessageChannelResponse> selectProjectMessageChannels(@PathVariable String spaceCode, @PathVariable Long projectId) {
        List<ProjectMessageChannelDTO> projectMessageChannels = projectService.selectProjectMessageChannels(projectId);
        return projectMessageChannels.stream().map(ProjectMessageChannelResponse::new).collect(Collectors.toList());
    }

    @PostMapping("/{projectId}/images")
    public ProjectFileResponse createProjectImage(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam("file") MultipartFile file,
        @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {
        String path = projectFileService.createImage(projectId, file);
        ProjectFileDTO testcaseFile = ProjectFileDTO
            .builder()
            .project(ProjectDTO.builder().id(projectId).build())
            .name(name).size(size).type(type).path(path).uuid(UUID.randomUUID().toString())
            .fileSourceType(FileSourceTypeCode.PROJECT)
            .build();
        ProjectFileDTO projectFile = projectFileService.createProjectFile(testcaseFile);
        return new ProjectFileResponse(projectFile, spaceCode, projectId);
    }

    @GetMapping("/{projectId}/images/{imageId}")
    public ResponseEntity<Resource> selectProjectImage(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable Long imageId, @RequestParam(value = "uuid") String uuid) {
        ProjectFileDTO projectFile = projectFileService.selectProjectFile(projectId, imageId, uuid);
        Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());
        ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(projectFile.getName(), StandardCharsets.UTF_8).build();

        return ResponseEntity.ok().contentType(MediaType.parseMediaType("application/octet-stream")).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString()).body(resource);
    }
}
