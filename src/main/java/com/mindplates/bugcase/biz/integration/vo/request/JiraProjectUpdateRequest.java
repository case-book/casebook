package com.mindplates.bugcase.biz.integration.vo.request;

import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class JiraProjectUpdateRequest {
    @NotEmpty
    private String key;

    public JiraProjectDTO toDTO(JiraProjectDTO jiraProjectDTO) {
        return JiraProjectDTO.builder()
            .jiraProjectKey(jiraProjectDTO.getJiraProjectKey())
            .jiraProjectName(jiraProjectDTO.getJiraProjectName())
            .build();
    }

}
