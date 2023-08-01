package com.mindplates.bugcase.biz.integration.vo.response;

import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectIntegrationResponse {

    private JiraProjectResponse jiraProject;

    public ProjectIntegrationResponse(JiraProjectDTO jiraProject) {
        this.jiraProject = new JiraProjectResponse(jiraProject);
    }

}
