package com.mindplates.bugcase.biz.integration.vo.response;

import com.mindplates.bugcase.biz.integration.dto.JiraIntegrationDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JiraIntegrationResponse {

    private Long id;
    private String name;
    private String apiUrl;
    private String apiToken;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public JiraIntegrationResponse(JiraIntegrationDTO jiraIntegrationDTO) {
        this.id = jiraIntegrationDTO.getId();
        this.name = jiraIntegrationDTO.getName();
        this.apiUrl = jiraIntegrationDTO.getApiUrl();
        this.apiToken = jiraIntegrationDTO.getApiToken();
        this.creationDate = jiraIntegrationDTO.getCreationDate();
        this.lastUpdateDate = jiraIntegrationDTO.getLastUpdateDate();
    }

}
