package com.mindplates.bugcase.biz.integration.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
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
    name = "jira_project",
    indexes = {
        @Index(name = "IDX_JIRA_PROJECT_PROJECT_ID", columnList = "project_id", unique = true)
    }
)
@Entity
public class JiraProject extends CommonEntity {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String jiraProjectKey;
    @Column
    private String jiraProjectName;
    @OneToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public void update(JiraProject jiraProject) {
        if (!Objects.isNull(jiraProject.getJiraProjectKey())) {
            this.jiraProjectKey = jiraProject.getJiraProjectKey();
        }
        if (!Objects.isNull(jiraProject.getJiraProjectName())) {
            this.jiraProjectName = jiraProject.getJiraProjectName();
        }
    }

}
