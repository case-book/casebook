package com.mindplates.bugcase.biz.integration.vo.response;

import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IntegrationResponse {

    private JiraResponse jira;

    public IntegrationResponse(JiraDTO jiraDTO) {
        this.jira = new JiraResponse(jiraDTO);
    }

}
