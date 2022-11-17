package com.mindplates.bugcase.biz.project.controller;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.project.vo.request.ProjectRequest;
import com.mindplates.bugcase.biz.project.vo.response.ProjectListResponse;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.service.TestcaseItemFileService;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects")
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    private final TestcaseItemFileService projectFileService;
    private final SpaceService spaceService;


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
        Optional<Space> space = spaceService.selectSpaceInfo(spaceCode);
        if (space.isPresent()) {
            project.setSpace(space.get());
        } else {
            throw new ServiceException(HttpStatus.NOT_FOUND);
        }

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

        if (testcaseTemplates.size() > 0 && !hasDefault.get()) {
            testcaseTemplates.get(0).setIsDefault(true);
        }

        List<ProjectUser> projectUserList = projectRequest.getUsers().stream().map(
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
        spaceService.selectSpaceInfo(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
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


}
