package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Table(name = "testcase", indexes = {
    @Index(name = "IDX_TESTCASE_PROJECT_ID_AND_SEQ_ID", columnList = "project_id, seq_id", unique = true)
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Testcase extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seq_id", nullable = false, length = ColumnsDef.CODE)
    private String seqId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_group_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__TESTCASE_GROUP"))
    private TestcaseGroup testcaseGroup;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @Column(name = "item_order")
    private Integer itemOrder;

    @Column(name = "closed")
    private Boolean closed;

    @OneToOne
    @JoinColumn(name = "testcase_template_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__TESTCASE_TEMPLATE"))
    private TestcaseTemplate testcaseTemplate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "testcase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestcaseItem> testcaseItems;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__PROJECT"))
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_release_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__PROJECT_RELEASE"))
    private ProjectRelease projectRelease;

    @Column(name = "tester_type", length = ColumnsDef.CODE)
    private String testerType;

    @Column(name = "tester_value", length = ColumnsDef.CODE)
    private String testerValue;

    @Column(name = "content_update_date")
    private LocalDateTime contentUpdateDate;


}
