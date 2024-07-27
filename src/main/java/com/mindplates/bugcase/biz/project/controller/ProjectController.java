package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectListDTO;
import com.mindplates.bugcase.biz.project.service.ProjectCachedService;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.project.vo.request.ProjectCreateRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.security.AllowProjectRole;
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

    private final ProjectCachedService projectCachedService;

    private final ProjectFileService projectFileService;

    private final FileUtil fileUtil;

    @Operation(description = "프로젝트 생성")
    @PostMapping("")
    public ProjectResponse createProjectInfo(@PathVariable String spaceCode, @Valid @RequestBody ProjectCreateRequest projectCreateRequest) {
        ProjectDTO project = projectService.createProjectInfo(spaceCode, projectCreateRequest.toDTO());
        return new ProjectResponse(project, SessionUtil.getUserId());
    }

    @Operation(description = "프로젝트 조회")
    @GetMapping("/{projectId}")
    public ProjectResponse selectProjectInfo(@PathVariable String spaceCode, @PathVariable long projectId) {
        ProjectDTO project = projectCachedService.selectProjectInfo(spaceCode, projectId);
        return new ProjectResponse(project, SessionUtil.getUserId());
    }

    @Operation(description = "스페이스 프로젝트 목록 조회")
    @GetMapping("/my")
    public List<ProjectListResponse> selectSpaceMyProjectList(@PathVariable String spaceCode) {
        long userId = SessionUtil.getUserId(true);
        List<ProjectListDTO> projectList = projectService.selectUserSpaceProjectList(spaceCode, userId);
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
        projectService.deleteProjectInfo(spaceCode, projectId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "프로젝트 이름 조회")
    @GetMapping("/{projectId}/name")
    public ProjectResponse selectProjectName(@PathVariable String spaceCode, @PathVariable long projectId) {
        String projectName = projectService.selectProjectName(spaceCode, projectId);
        return ProjectResponse.builder().name(projectName).build();
    }

    @AllowProjectRole(value = UserRoleCode.USER)
    @Operation(description = "프로젝트 탈퇴")
    @DeleteMapping("/{projectId}/users/my")
    public ResponseEntity<?> deleteProjectUserInfo(@PathVariable String spaceCode, @PathVariable long projectId) {
        projectService.deleteProjectUser(spaceCode, projectId, SessionUtil.getUserId(true));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{projectId}/images")
    public ProjectFileResponse createProjectImage(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam("file") MultipartFile file, @RequestParam("name") String name,
        @RequestParam("size") Long size, @RequestParam("type") String type) {
        ProjectFileDTO result = projectFileService.createProjectFile(projectId, name, size, type, file);
        return new ProjectFileResponse(result, spaceCode, projectId);
    }

    @GetMapping("/{projectId}/images/{imageId}")
    public ResponseEntity<Resource> selectProjectImage(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable Long imageId, @RequestParam(value = "uuid") String uuid) {
        ProjectFileDTO projectFile = projectFileService.selectProjectFile(projectId, imageId, uuid);
        Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());
        ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(projectFile.getName(), StandardCharsets.UTF_8).build();
        return ResponseEntity.ok().contentType(MediaType.parseMediaType("application/octet-stream")).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString()).body(resource);
    }
}
