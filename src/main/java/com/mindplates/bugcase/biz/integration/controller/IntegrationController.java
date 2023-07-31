package com.mindplates.bugcase.biz.integration.controller;

import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import com.mindplates.bugcase.biz.integration.service.JiraService;
import com.mindplates.bugcase.biz.integration.vo.request.JiraIntegrationUpdateRequest;
import com.mindplates.bugcase.biz.integration.vo.response.IntegrationResponse;
import io.swagger.v3.oas.annotations.Operation;
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
        @RequestBody JiraIntegrationUpdateRequest request
    ) {
        JiraDTO result = jiraService.upsertJiraIntegrationInfo(spaceCode, request.toDTO());
        return new IntegrationResponse(result);
    }

    @GetMapping("/spaces/{spaceCode}/integrations/jira/projects")
    @Operation(description = "SPACE 에 연동된 지라의 프로젝트 목록 조회")
    public String getJiraProjects(
        @PathVariable String spaceCode
    ) {

        return null;
    }

    @GetMapping("/{spaceCode}/projects/{projectId}/integrations/jira/projects")
    @Operation(description = "PROJECT 의 지라 프로젝트 수정")
    public String updateJiraProjectsByProjectId(
        @PathVariable String spaceCode,
        @PathVariable long projectId
    ) {

        return null;
    }

    @GetMapping("/{spaceCode}/projects/{projectId}/integrations/jira/sprints")
    @Operation(description = "PROJECT 에 연동된 지라 프로젝트의 스프린트 목록 조회")
    public String getJiraSprintsByProjectId(
        @PathVariable String spaceCode,
        @PathVariable long projectId
    ) {

        return null;
    }

}
