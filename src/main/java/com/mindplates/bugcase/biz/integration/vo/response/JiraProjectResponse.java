package com.mindplates.bugcase.biz.integration.vo.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
import java.util.Objects;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JiraProjectResponse {

    private Long id;
    private String key;
    private String name;

    public JiraProjectResponse(JiraProjectDTO jiraProjectDto) {
        if(!Objects.isNull(jiraProjectDto)) {
            this.id = jiraProjectDto.getId();
            this.key = jiraProjectDto.getJiraProjectKey();
            this.name = jiraProjectDto.getJiraProjectName();
        }
    }

}
