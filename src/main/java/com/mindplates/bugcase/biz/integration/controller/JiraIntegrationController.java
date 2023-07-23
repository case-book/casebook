package com.mindplates.bugcase.biz.integration.controller;

import com.mindplates.bugcase.biz.integration.dto.JiraIntegrationDTO;
import com.mindplates.bugcase.biz.integration.service.JiraIntegrationService;
import com.mindplates.bugcase.biz.integration.vo.request.JiraIntegrationUpdateRequest;
import com.mindplates.bugcase.biz.integration.vo.response.JiraIntegrationResponse;
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
public class JiraIntegrationController {

    private final JiraIntegrationService jiraIntegrationService;

    @PutMapping("/spaces/{spaceCode}/jira-integration")
    @Operation(description = "SPACE 의 Jira Integration 업데이트")
    public JiraIntegrationResponse upsertJiraIntegration(
        @PathVariable String spaceCode,
        @RequestBody JiraIntegrationUpdateRequest request
    ) {
        JiraIntegrationDTO result = jiraIntegrationService.upsertJiraIntegrationInfo(spaceCode, request.toDTO());
        return new JiraIntegrationResponse(result);
    }

    @GetMapping("/spaces/{spaceCode}/jira-integration")
    @Operation(description = "SPACE 에 설정된 Jira Integration 조회")
    public JiraIntegrationResponse getJiraIntegration(
        @PathVariable String spaceCode
    ) {
        JiraIntegrationDTO result = jiraIntegrationService.getBySpaceCode(spaceCode);
        return new JiraIntegrationResponse(result);
    }

}
