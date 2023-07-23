package com.mindplates.bugcase.biz.integration.vo.request;

import com.mindplates.bugcase.biz.integration.dto.JiraIntegrationDTO;
import lombok.Data;

@Data
public class JiraIntegrationUpdateRequest {

    private Long id;
    private String name;
    private String apiUrl;
    private String apiToken;

    public JiraIntegrationDTO toDTO() {
        return JiraIntegrationDTO.builder()
            .id(this.id)
            .name(this.name)
            .apiUrl(this.apiUrl)
            .apiToken(this.apiToken)
            .build();
    }

}
