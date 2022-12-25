package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.project.vo.request.ProjectRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
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
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
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


    @Operation(description = "스페이스 프로젝트 목록 조회")
    @GetMapping("")
    public List<ProjectListResponse> selectSpaceProjectSpaceList(@PathVariable String spaceCode) {
        List<Project> projects = projectService.selectSpaceProjectList(spaceCode);
        return projects.stream().map(ProjectListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 생성")
    @PostMapping("")
    public ProjectResponse createProjectInfo(@PathVariable String spaceCode, @Valid @RequestBody ProjectRequest projectRequest) {

        Project alreadyProject = projectService.selectByName(spaceCode, projectRequest.getName());
        if (alreadyProject != null) {
            throw new ServiceException("project.duplicated");
        }

        Project project = projectRequest.buildEntity();
        SpaceDTO spaceDTO = spaceService.selectSpaceInfo(spaceCode);
        project.setSpace(Space.builder().id(spaceDTO.getId()).build());

        AtomicBoolean hasDefault = new AtomicBoolean(false);
        List<TestcaseTemplate> testcaseTemplates = projectRequest.getTestcaseTemplates().stream().map((testcaseTemplateRequest -> {

            if (hasDefault.get() && testcaseTemplateRequest.getIsDefault() != null && testcaseTemplateRequest.getIsDefault()) {
                testcaseTemplateRequest.setIsDefault(false);
            }

            if (!hasDefault.get() && testcaseTemplateRequest.getIsDefault() != null && testcaseTemplateRequest.getIsDefault()) {
                hasDefault.set(true);
            }

            TestcaseTemplate testcaseTemplate = testcaseTemplateRequest.buildEntity();
            testcaseTemplate.setProject(project);
            return testcaseTemplate;
        })).filter(testcaseTemplate -> !testcaseTemplate.isDeleted()).collect(Collectors.toList());


        if (!testcaseTemplates.isEmpty() && !hasDefault.get()) {
            testcaseTemplates.get(0).setIsDefault(true);
        }

        project.setTestcaseTemplates(testcaseTemplates);

        return new ProjectResponse(projectService.createProjectInfo(spaceCode, project, SessionUtil.getUserId()), SessionUtil.getUserId());
    }

    @Operation(description = "프로젝트 수정")
    @PutMapping("/{id}")
    public ProjectResponse updateProjectInfo(@PathVariable String spaceCode, @PathVariable Long id, @Valid @RequestBody ProjectRequest projectRequest) {

        if (!id.equals(projectRequest.getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        Optional<Project> projectInfo = projectService.selectProjectInfo(spaceCode, id);

        if (!projectInfo.isPresent()) {
            throw new ServiceException(HttpStatus.NOT_FOUND);
        }

        Project nextProject = projectInfo.get();
        nextProject.setName(projectRequest.getName());
        nextProject.setActivated(projectRequest.getActivated());
        nextProject.setDescription(projectRequest.getDescription());
        nextProject.setToken(projectRequest.getToken());

        AtomicBoolean hasDefault = new AtomicBoolean(false);
        List<TestcaseTemplate> testcaseTemplates = projectRequest.getTestcaseTemplates().stream().map((testcaseTemplateRequest -> {

            if (!"D".equals(testcaseTemplateRequest.getCrud()) && hasDefault.get() && testcaseTemplateRequest.getIsDefault() != null && testcaseTemplateRequest.getIsDefault()) {
                testcaseTemplateRequest.setIsDefault(false);
            }

            if (!"D".equals(testcaseTemplateRequest.getCrud()) && !hasDefault.get() && testcaseTemplateRequest.getIsDefault() != null && testcaseTemplateRequest.getIsDefault()) {
                hasDefault.set(true);
            }

            TestcaseTemplate testcaseTemplate = testcaseTemplateRequest.buildEntity();
            testcaseTemplate.setProject(nextProject);
            return testcaseTemplate;
        })).filter(testcaseTemplate -> !testcaseTemplate.isDeleted()).collect(Collectors.toList());

        if (!testcaseTemplates.isEmpty() && !hasDefault.get()) {
            testcaseTemplates.get(0).setIsDefault(true);
        }

        List<ProjectUser> projectUserList = projectRequest.getUsers().stream().filter((spaceUser) -> spaceUser.getCrud() == null || !spaceUser.getCrud().equals("D")).map(
                (spaceUser) -> ProjectUser.builder()
                        .id(spaceUser.getId())
                        .user(com.mindplates.bugcase.biz.user.entity.User.builder().id(spaceUser.getUserId()).build())
                        .role(spaceUser.getRole())
                        .crud(spaceUser.getCrud())
                        .project(nextProject).build()).collect(Collectors.toList());

        nextProject.setUsers(projectUserList);

        nextProject.setTestcaseTemplates(testcaseTemplates);

        return new ProjectResponse(projectService.updateProjectInfo(spaceCode, nextProject), SessionUtil.getUserId());
    }

    @Operation(description = "프로젝트 삭제")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProjectInfo(@PathVariable String spaceCode, @PathVariable Long id) {
        Project project = projectService.selectProjectInfo(spaceCode, id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectService.deleteProjectInfo(spaceCode, project);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "프로젝트 조회")
    @GetMapping("/{id}")
    public ProjectResponse selectProjectInfo(@PathVariable String spaceCode, @PathVariable Long id) {
        SpaceDTO spaceDTO = spaceService.selectSpaceInfo(spaceCode);
        boolean isSpaceMember = spaceService.selectIsSpaceMember(spaceCode, SessionUtil.getUserId());

        if (!isSpaceMember) {
            throw new ServiceException("common.not.authorized");
        }

        Project project = projectService.selectProjectInfo(spaceCode, id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (!project.isActivated()) {
            throw new ServiceException(HttpStatus.LOCKED);
        }

        return new ProjectResponse(project, SessionUtil.getUserId());
    }

    @PostMapping("/{id}/images")
    public ProjectFileResponse createProjectImage(@PathVariable String spaceCode, @PathVariable Long id, @RequestParam("file") MultipartFile file, @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {

        String path = projectFileService.createImage(id, file);

        ProjectFile testcaseItemFile = ProjectFile.builder()
                .project(Project.builder().id(id).build())
                .name(name)
                .size(size)
                .type(type)
                .path(path)
                .uuid(UUID.randomUUID().toString())
                .build();

        ProjectFile projectFile = projectFileService.createProjectFile(testcaseItemFile);
        return new ProjectFileResponse(projectFile, spaceCode, id);
    }

    @GetMapping("/{id}/images/{imageId}")
    public ResponseEntity<Resource> selectProjectImage(@PathVariable String spaceCode, @PathVariable Long id, @PathVariable Long imageId, @RequestParam(value = "uuid") String uuid) {

        ProjectFile projectFile = projectFileService.selectProjectFile(id, imageId, uuid);
        Resource resource = fileUtil.loadFileAsResource(projectFile.getPath());

        ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(projectFile.getName(), StandardCharsets.UTF_8).build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(resource);
    }


}
