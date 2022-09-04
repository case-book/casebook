package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.common.constants.ColumnsDef;
import com.mindplates.bugcase.biz.common.entity.CommonEntity;
import com.mindplates.bugcase.biz.project.entity.Project;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@Table(name = "testcase")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Testcase extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "case_order")
    private Integer caseOrder;

    @Column(name = "closed")
    private Boolean closed;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__PROJECT"))
    private Project project;

    @OneToOne
    @JoinColumn(name = "testcase_template_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__TESTCASE_TEMPLATE"))
    private TestcaseTemplate testcaseTemplate;

}
