package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.service.ProjectReleaseService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.project.service.ProjectTokenService;
import com.mindplates.bugcase.biz.project.vo.request.CreateProjectTokenRequest;
import com.mindplates.bugcase.biz.project.vo.request.ProjectCreateRequest;
import com.mindplates.bugcase.biz.project.vo.request.ProjectReleaseCreateRequest;
import com.mindplates.bugcase.biz.project.vo.request.UpdateProjectTokenRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectReleaseResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectTokenResponse;
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

    @Operation(description = "스페이스 프로젝트 목록 조회")
    @GetMapping("")
    public List<ProjectListResponse> selectSpaceProjectList(@PathVariable String spaceCode) {
        List<ProjectDTO> projectList = projectService.selectSpaceProjectList(spaceCode);
        return projectList.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "스페이스 프로젝트 목록 조회")
    @GetMapping("/my")
    public List<ProjectListResponse> selectSpaceMyProjectList(@PathVariable String spaceCode) {
        List<ProjectDTO> projectList = projectService.selectSpaceMyProjectList(spaceCode, SessionUtil.getUserId());
        return projectList.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 생성")
    @PostMapping("")
    public ProjectResponse createProjectInfo(@PathVariable String spaceCode, @Valid @RequestBody ProjectCreateRequest projectCreateRequest) {

        if (projectService.existByName(spaceCode, projectCreateRequest.getName())) {
            throw new ServiceException("error.project.duplicated");
        }

        ProjectDTO project = projectCreateRequest.toDTO();
        return new ProjectResponse(projectService.createProjectInfo(spaceCode, project, SessionUtil.getUserId()), SessionUtil.getUserId());
    }

    @Operation(description = "프로젝트 수정")
    @PutMapping("/{id}")
    public ProjectResponse updateProjectInfo(@PathVariable String spaceCode, @PathVariable Long id,
        @Valid @RequestBody ProjectCreateRequest projectUpdateRequest) {

        if (!id.equals(projectUpdateRequest.getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        ProjectDTO project = projectUpdateRequest.toDTO();
        return new ProjectResponse(projectService.updateProjectInfo(spaceCode, project), SessionUtil.getUserId());
    }


    @Operation(description = "프로젝트 삭제")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProjectInfo(@PathVariable String spaceCode, @PathVariable Long id) {
        ProjectDTO project = projectService.selectProjectInfo(spaceCode, id);
        projectService.deleteProjectInfo(spaceCode, project);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "프로젝트 조회")
    @GetMapping("/{id}")
    public ProjectResponse selectProjectInfo(@PathVariable String spaceCode, @PathVariable Long id) {
        ProjectDTO project = projectService.selectProjectInfo(spaceCode, id);

        /*
        if (!project.isActivated()) {
            throw new ServiceException(HttpStatus.LOCKED);
        }
         */

        return new ProjectResponse(project, SessionUtil.getUserId());
    }

    @Operation(description = "프로젝트 이름 조회")
    @GetMapping("/{id}/name")
    public ProjectResponse selectProjectName(@PathVariable String spaceCode, @PathVariable Long id) {
        ProjectDTO project = projectService.selectProjectName(spaceCode, id);
        return ProjectResponse.builder().name(project.getName()).build();
    }

    @PostMapping("/{id}/images")
    public ProjectFileResponse createProjectImage(@PathVariable String spaceCode, @PathVariable Long id, @RequestParam("file") MultipartFile file,
        @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {
        String path = projectFileService.createImage(id, file);
        ProjectFileDTO testcaseFile = ProjectFileDTO.builder().project(ProjectDTO.builder().id(id).build()).name(name).size(size).type(type)
            .path(path).uuid(UUID.randomUUID().toString()).fileSourceType(FileSourceTypeCode.PROJECT).build();
        ProjectFileDTO projectFile = projectFileService.createProjectFile(testcaseFile);
        return new ProjectFileResponse(projectFile, spaceCode, id);
    }

    @GetMapping("/{id}/images/{imageId}")
    public ResponseEntity<Resource> selectProjectImage(@PathVariable String spaceCode, @PathVariable Long id, @PathVariable Long imageId,
        @RequestParam(value = "uuid") String uuid) {

        ProjectFileDTO projectFile = projectFileService.selectProjectFile(id, imageId, uuid);
        Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());

        ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(projectFile.getName(), StandardCharsets.UTF_8)
            .build();

        return ResponseEntity.ok().contentType(MediaType.parseMediaType("application/octet-stream"))
            .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString()).body(resource);
    }

    @Operation(description = "프로젝트 탈퇴")
    @DeleteMapping("/{id}/users/my")
    public ResponseEntity<?> deleteProjectUserInfo(@PathVariable String spaceCode, @PathVariable Long id) {
        projectService.deleteProjectUser(spaceCode, id, SessionUtil.getUserId());
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "프로젝트 토큰 목록")
    @GetMapping("/{id}/tokens")
    public List<ProjectTokenResponse> selectProjectTokenList(@PathVariable Long id) {
        List<ProjectTokenDTO> projectTokenList = projectTokenService.selectProjectTokenList(id);
        return projectTokenList.stream().map(ProjectTokenResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 토큰 조회")
    @GetMapping("/{id}/tokens/{tokenId}")
    public ProjectTokenResponse selectProjectTokenInfo(@PathVariable String spaceCode, @PathVariable Long id, @PathVariable Long tokenId) {
        ProjectTokenDTO projectToken = projectTokenService.selectProjectTokenInfo(tokenId);
        return new ProjectTokenResponse(projectToken);
    }

    @Operation(description = "프로젝트 토큰 생성")
    @PostMapping("/{id}/tokens")
    public ProjectTokenResponse createProjectToken(@PathVariable String spaceCode, @PathVariable Long id,
        @Valid @RequestBody CreateProjectTokenRequest createProjectTokenRequest) {
        ProjectTokenDTO projectTokenDTO = createProjectTokenRequest.toDTO(id);
        return new ProjectTokenResponse(projectTokenService.createProjectToken(projectTokenDTO));
    }

    @Operation(description = "프로젝트 토큰 변경")
    @PutMapping("/{id}/tokens/{tokenId}")
    public ProjectTokenResponse updateProjectToken(@PathVariable String spaceCode, @PathVariable Long id, @PathVariable Long tokenId,
        @Valid @RequestBody UpdateProjectTokenRequest updateProjectTokenRequest) {

        ProjectTokenDTO targetProjectToken = projectTokenService.selectProjectTokenInfo(tokenId);
        if (!id.equals(targetProjectToken.getProject().getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        ProjectTokenDTO projectTokenDTO = updateProjectTokenRequest.toDTO();
        return new ProjectTokenResponse(projectTokenService.updateProjectToken(tokenId, projectTokenDTO));
    }

    @Operation(description = "프로젝트 토큰 삭제")
    @DeleteMapping("/{id}/tokens/{tokenId}")
    public ResponseEntity<?> deleteProjectToken(@PathVariable String spaceCode, @PathVariable Long id, @PathVariable Long tokenId) {
        ProjectTokenDTO projectToken = projectTokenService.selectProjectTokenInfo(tokenId);
        if (!id.equals(projectToken.getProject().getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        projectTokenService.deleteProjectToken(tokenId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "프로젝트의 릴리즈 목록 조회")
    @GetMapping("/{id}/releases")
    public List<ProjectReleaseResponse> getRelease(
        @PathVariable long id
    ) {
        List<ProjectReleaseDTO> projectReleaseDTOs = projectReleaseService.selectProjectReleases(id);
        return projectReleaseDTOs
            .stream()
            .map(projectReleaseDTO -> new ProjectReleaseResponse(projectReleaseDTO, SessionUtil.getUserId()))
            .collect(Collectors.toList());
    }

    @Operation(description = "릴리즈 생성")
    @PostMapping("/{id}/releases")
    public ProjectReleaseResponse createProjectRelease(@PathVariable Long id,
        @Valid @RequestBody ProjectReleaseCreateRequest projectReleaseCreateRequest) {
        ProjectReleaseDTO projectReleaseDTO = projectReleaseCreateRequest.toDTO(id);
        return new ProjectReleaseResponse(projectReleaseService.createProjectRelease(projectReleaseDTO), SessionUtil.getUserId());
    }

    @Operation(description = "릴리즈 수정")
    @PutMapping("/{id}/releases/{releaseId}")
    public ProjectReleaseResponse updateProjectRelease(@PathVariable long id,
        @PathVariable long releaseId,
        @Valid @RequestBody ProjectReleaseCreateRequest projectReleaseCreateRequest) {
        ProjectReleaseDTO projectReleaseDTO = projectReleaseCreateRequest.toDTO(id);
        return new ProjectReleaseResponse(projectReleaseService.updateProjectRelease(releaseId, projectReleaseDTO), SessionUtil.getUserId());
    }

    @Operation(description = "릴리즈 삭제")
    @DeleteMapping("/{id}/releases/{releaseId}")
    public void deleteProjectRelease(@PathVariable long releaseId) {
        projectReleaseService.deleteProjectRelease(releaseId);
    }
}
