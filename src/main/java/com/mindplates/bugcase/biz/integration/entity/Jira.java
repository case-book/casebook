package com.mindplates.bugcase.biz.integration.entity;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
@Table(
    name = "jira",
    indexes = {
        @Index(name = "IDX_JIRA_SPACE_ID", columnList = "space_id", unique = true)
    }
)
@Entity
public class Jira extends CommonEntity {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String name;
    @Column
    private String apiUrl;
    @Column
    @Size(max = 1024)
    private String apiToken;
    @OneToOne
    @JoinColumn(name = "space_id")
    private Space space;
    @Column
    @Enumerated(EnumType.STRING)
    private JiraType type;

    public void update(Jira jira) {
        if (!Objects.isNull(jira.getName())) {
            this.name = jira.getName();
        }
        if (!Objects.isNull(jira.getApiUrl())) {
            this.apiUrl = jira.getApiUrl();
        }
        if (!Objects.isNull(jira.getApiToken()) && !jira.getApiToken().contains("*")) {
            this.apiToken = jira.getApiToken();
        }
        if (!Objects.isNull(jira.getType())) {
            this.type = jira.getType();
        }
    }
}
