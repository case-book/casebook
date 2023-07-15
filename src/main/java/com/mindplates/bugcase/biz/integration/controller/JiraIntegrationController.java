package com.mindplates.bugcase.biz.integration.controller;

import com.mindplates.bugcase.biz.integration.dto.JiraIntegrationDTO;
import com.mindplates.bugcase.biz.integration.service.JiraIntegrationService;
import com.mindplates.bugcase.biz.integration.vo.request.JiraIntegrationUpdateRequest;
import com.mindplates.bugcase.biz.integration.vo.response.JiraIntegrationResponse;
import io.swagger.v3.oas.annotations.Operation;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller("/api/spaces/{spaceCode}/jira-integration")
@RequiredArgsConstructor
public class JiraIntegrationController {

    private final JiraIntegrationService jiraIntegrationService;

    @PutMapping
    @Operation(description = "SPACE 의 Jira Integration 업데이트(Upsert)")
    public JiraIntegrationResponse upsertJiraIntegration(
        @PathVariable String spaceCode,
        @RequestBody @Valid JiraIntegrationUpdateRequest request
    ) {
        JiraIntegrationDTO result = jiraIntegrationService.upsertJiraIntegrationInfo(spaceCode, request.toDTO());
        return new JiraIntegrationResponse(result);
    }

}
