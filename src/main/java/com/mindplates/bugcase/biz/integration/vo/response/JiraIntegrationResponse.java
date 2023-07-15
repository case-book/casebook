package com.mindplates.bugcase.biz.integration.vo.response;

import com.mindplates.bugcase.biz.integration.dto.JiraIntegrationDTO;
import com.mindplates.bugcase.common.util.MaskingUtil;
import java.time.LocalDateTime;
import java.util.Objects;

public class JiraIntegrationResponse {

    private long id;
    private String name;
    private String apiUrl;
    private String apiToken;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public JiraIntegrationResponse(JiraIntegrationDTO jiraIntegrationDTO) {
        this.id = jiraIntegrationDTO.getId();
        this.name = jiraIntegrationDTO.getName();
        this.apiUrl = jiraIntegrationDTO.getApiUrl();
        String apiToken = jiraIntegrationDTO.getApiToken();
        if (!Objects.isNull(apiToken)) {
            this.apiToken = MaskingUtil.maskValue(apiToken, "*", apiToken.length() / 2, apiToken.length());
        }
        this.creationDate = jiraIntegrationDTO.getCreationDate();
        this.lastUpdateDate = jiraIntegrationDTO.getLastUpdateDate();
    }


}
