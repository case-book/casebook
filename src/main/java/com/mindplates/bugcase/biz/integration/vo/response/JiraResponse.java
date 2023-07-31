package com.mindplates.bugcase.biz.integration.vo.response;

import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JiraResponse {

    private Long id;
    private String name;
    private String apiUrl;
    private String apiToken;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public JiraResponse(JiraDTO jiraDTO) {
        this.id = jiraDTO.getId();
        this.name = jiraDTO.getName();
        this.apiUrl = jiraDTO.getApiUrl();
        this.apiToken = jiraDTO.getApiToken();
        this.creationDate = jiraDTO.getCreationDate();
        this.lastUpdateDate = jiraDTO.getLastUpdateDate();
    }

}
