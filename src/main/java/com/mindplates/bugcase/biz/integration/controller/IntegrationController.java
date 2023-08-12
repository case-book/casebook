package com.mindplates.bugcase.biz.integration.controller;

import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
import com.mindplates.bugcase.biz.integration.service.JiraService;
import com.mindplates.bugcase.biz.integration.vo.response.IntegrationResponse;
import com.mindplates.bugcase.biz.integration.vo.response.ProjectIntegrationResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/{spaceCode}/projects/{projectId}/integrations")
    @Operation(description = "PROJECT 와 연동된 Integration 정보 조회")
    public ProjectIntegrationResponse getJiraIntegrationByProjectId(
        @PathVariable String spaceCode,
        @PathVariable long projectId
    ) {
        JiraProjectDTO result = jiraService.getJiraProjectIntegrationBySpaceCodeAndProjectId(spaceCode, projectId);
        return new ProjectIntegrationResponse(result);
    }

}
