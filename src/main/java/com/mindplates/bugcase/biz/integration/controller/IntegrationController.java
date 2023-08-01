package com.mindplates.bugcase.biz.integration.controller;

import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
import com.mindplates.bugcase.biz.integration.service.JiraService;
import com.mindplates.bugcase.biz.integration.vo.request.JiraProjectUpdateRequest;
import com.mindplates.bugcase.biz.integration.vo.request.JiraUpdateRequest;
import com.mindplates.bugcase.biz.integration.vo.response.IntegrationResponse;
import com.mindplates.bugcase.biz.integration.vo.response.JiraProjectResponse;
import com.mindplates.bugcase.biz.integration.vo.response.ProjectIntegrationResponse;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class IntegrationController {

    private final JiraService jiraService;

    @GetMapping("/spaces/{spaceCode}/integrations")
    @Operation(description = "SPACE 에 설정된 Integration 정보 조회")
    public IntegrationResponse getJiraIntegration(
        @PathVariable String spaceCode
    ) {
        JiraDTO result = jiraService.getBySpaceCode(spaceCode);
        return new IntegrationResponse(result);
    }

    @PutMapping("/spaces/{spaceCode}/integrations/jira")
    @Operation(description = "SPACE 의 Jira Integration 업데이트")
    public IntegrationResponse upsertJiraIntegration(
        @PathVariable String spaceCode,
        @RequestBody JiraUpdateRequest request
    ) {
        JiraDTO result = jiraService.upsertJiraIntegrationInfo(spaceCode, request.toDTO());
        return new IntegrationResponse(result);
    }

    @GetMapping("/spaces/{spaceCode}/integrations/jira/projects")
    @Operation(description = "SPACE 에 연동된 지라에 존재하는 프로젝트 목록 조회")
    public List<JiraProjectResponse> getJiraProjects(
        @PathVariable String spaceCode
    ) {
        return jiraService.getJiraProjectsBySpaceCode(spaceCode).stream().map(JiraProjectResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/{spaceCode}/projects/{projectId}/integrations")
    @Operation(description = "PROJECT 와 연동된 Integration 정보 조회")
    public ProjectIntegrationResponse getJiraIntegrationByProjectId(
        @PathVariable String spaceCode,
        @PathVariable long projectId
    ) {
        JiraProjectDTO result = jiraService.getJiraProjectIntegrationBySpaceCodeAndProjectId(spaceCode, projectId);
        return new ProjectIntegrationResponse(result);
    }

    @PutMapping("/{spaceCode}/projects/{projectId}/integrations/jira")
    @Operation(description = "PROJECT 와 연동된 지라 프로젝트 수정")
    public JiraProjectResponse updateJiraProjectsByProjectId(
        @PathVariable String spaceCode,
        @PathVariable long projectId,
        @RequestBody @Valid JiraProjectUpdateRequest request
    ) {
        JiraProjectDTO jiraProjectDTO = jiraService.getJiraProjectBySpaceCodeAndProjectIdAndJiraProjectKey(spaceCode, projectId, request.getKey());
        jiraProjectDTO = request.toDTO(jiraProjectDTO);
        return new JiraProjectResponse(jiraService.upsertJiraProjectIntegrationInfo(spaceCode, projectId, jiraProjectDTO));
    }

    @GetMapping("/{spaceCode}/projects/{projectId}/integrations/jira/issues")
    @Operation(description = "PROJECT 와 연동된 지라 프로젝트의 이슈 목록 조회")
    public String getJiraSprintsByProjectId(
        @PathVariable String spaceCode,
        @PathVariable long projectId
    ) {

        return null;
    }

    @GetMapping("/{spaceCode}/projects/{projectId}/integrations/jira/boards/{boardId}/sprints")
    @Operation(description = "PROJECT 와 연동된 지라 프로젝트의 스프린트 목록 조회")
    public String getJiraSprintsByProjectId(
        @PathVariable String spaceCode,
        @PathVariable long projectId,
        @PathVariable String boardId
    ) {

        return null;
    }

}
