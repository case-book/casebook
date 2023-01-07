package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.project.vo.request.ProjectCreateRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects")
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    private final SpaceService spaceService;

    private final ProjectFileService projectFileService;

    private final FileUtil fileUtil;

    private final MappingUtil mappingUtil;

    @Operation(description = "프로젝트 생성")
    @PostMapping("")
    public ProjectResponse createProjectInfo(@PathVariable String spaceCode, @Valid @RequestBody ProjectCreateRequest projectCreateRequest) {

        if (projectService.existByName(spaceCode, projectCreateRequest.getName())) {
            throw new ServiceException("project.duplicated");
        }

        ProjectDTO project = projectCreateRequest.toDTO();
        return new ProjectResponse(projectService.createProjectInfo(spaceCode, project, SessionUtil.getUserId()), SessionUtil.getUserId());
    }

    @Operation(description = "프로젝트 수정")
    @PutMapping("/{id}")
    public ProjectResponse updateProjectInfo(@PathVariable String spaceCode, @PathVariable Long id, @Valid @RequestBody ProjectCreateRequest projectUpdateRequest) {

        if (!id.equals(projectUpdateRequest.getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        ProjectDTO project = projectUpdateRequest.toDTO();
        return new ProjectResponse(projectService.updateProjectInfo(spaceCode, project), SessionUtil.getUserId());
    }


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
        boolean isSpaceMember = spaceService.selectIsSpaceMember(spaceCode, SessionUtil.getUserId());

        if (!isSpaceMember) {
            throw new ServiceException("common.not.authorized");
        }

        ProjectDTO project = projectService.selectProjectInfo(spaceCode, id);

        /*
        if (!project.isActivated()) {
            throw new ServiceException(HttpStatus.LOCKED);
        }
         */

        return new ProjectResponse(project, SessionUtil.getUserId());
    }

    @PostMapping("/{id}/images")
    public ProjectFileResponse createProjectImage(@PathVariable String spaceCode, @PathVariable Long id, @RequestParam("file") MultipartFile file, @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {

        String path = projectFileService.createImage(id, file);

        ProjectFileDTO testcaseFile = ProjectFileDTO.builder()
                .project(ProjectDTO.builder().id(id).build())
                .name(name)
                .size(size)
                .type(type)
                .path(path)
                .uuid(UUID.randomUUID().toString())
                .fileSourceType(FileSourceTypeCode.PROJECT)
                .build();

        ProjectFileDTO projectFile = projectFileService.createProjectFile(testcaseFile);
        return new ProjectFileResponse(projectFile, spaceCode, id);
    }

    @GetMapping("/{id}/images/{imageId}")
    public ResponseEntity<Resource> selectProjectImage(@PathVariable String spaceCode, @PathVariable Long id, @PathVariable Long imageId, @RequestParam(value = "uuid") String uuid) {

        ProjectFileDTO projectFile = projectFileService.selectProjectFile(id, imageId, uuid);
        Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());

        ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(projectFile.getName(), StandardCharsets.UTF_8).build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(resource);
    }

    @Operation(description = "프로젝트 탈퇴")
    @DeleteMapping("/{id}/users/my")
    public ResponseEntity<?> deleteProjectUserInfo(@PathVariable String spaceCode, @PathVariable Long id) {
        projectService.deleteProjectUser(spaceCode, id, SessionUtil.getUserId());
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
