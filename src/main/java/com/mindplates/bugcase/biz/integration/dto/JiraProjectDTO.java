package com.mindplates.bugcase.biz.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mindplates.bugcase.biz.integration.entity.JiraProject;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraProjectDTO {

    private Long id;
    @JsonProperty("key")
    private String jiraProjectKey;
    @JsonProperty("name")
    private String jiraProjectName;

    public JiraProjectDTO(JiraProject jiraProject) {
        if (!Objects.isNull(jiraProject)) {
            this.id = jiraProject.getId();
            this.jiraProjectKey = jiraProject.getJiraProjectKey();
            this.jiraProjectName = jiraProject.getJiraProjectName();
        }
    }

}
