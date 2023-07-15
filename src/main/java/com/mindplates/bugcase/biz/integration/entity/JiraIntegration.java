package com.mindplates.bugcase.biz.integration.entity;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.Data;

@Data
@Table(
    name = "jira_integration",
    indexes = {
        @Index(name = "IDX_JIRA_INTEGRATION_SPACE_ID", columnList = "space_id"),
        @Index(name = "IDX_JIRA_INTEGRATION_ID_AND_SPACE_ID", columnList = "id, space_id", unique = true)
    }
)
@Entity
public class JiraIntegration extends CommonEntity {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String name;
    @Column
    private String apiUrl;
    @Column
    private String apiToken;
    @OneToOne
    @JoinColumn(name = "space_id")
    private Space space;

    public void update(JiraIntegration jiraIntegration) {
        if (!Objects.isNull(jiraIntegration.getName())) {
            this.name = jiraIntegration.getName();
        }
        if (!Objects.isNull(jiraIntegration.getApiUrl())) {
            this.apiUrl = jiraIntegration.getApiUrl();
        }
        if (!Objects.isNull(jiraIntegration.getApiToken())) {
            this.apiUrl = jiraIntegration.getApiToken();
        }
    }
}
