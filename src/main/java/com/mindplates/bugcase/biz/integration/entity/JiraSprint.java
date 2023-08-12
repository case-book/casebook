package com.mindplates.bugcase.biz.integration.entity;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
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
    name = "jira_sprint",
    indexes = {
        @Index(name = "IDX_JIRA_SPRINT_TESTRUN_ID", columnList = "testrun_id", unique = true)
    }
)
@Entity
public class JiraSprint extends CommonEntity {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private Long sprintId;
    @Column
    private String sprintName;
    @OneToOne
    @JoinColumn(name = "testrun_id")
    private Testrun testrun;

    public void update(JiraSprint jiraSprint) {
        if (!Objects.isNull(jiraSprint.getSprintId())) {
            this.sprintId = jiraSprint.getSprintId();
        }
        if (!Objects.isNull(jiraSprint.getSprintName())) {
            this.sprintName = jiraSprint.getSprintName();
        }
    }

}
