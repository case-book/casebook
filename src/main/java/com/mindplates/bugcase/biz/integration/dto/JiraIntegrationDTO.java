package com.mindplates.bugcase.biz.integration.dto;

import com.mindplates.bugcase.biz.integration.entity.JiraIntegration;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class JiraIntegrationDTO extends CommonDTO {

    private long id;
    private String name;
    private String apiUrl;
    private String apiToken;
    private SpaceDTO space;

    public JiraIntegrationDTO(JiraIntegration jiraIntegration) {
        this.id = jiraIntegration.getId();
        this.name = jiraIntegration.getName();
        this.apiUrl = jiraIntegration.getApiUrl();
        this.apiToken = jiraIntegration.getApiToken();
        this.space = new SpaceDTO(jiraIntegration.getSpace());
    }

}
