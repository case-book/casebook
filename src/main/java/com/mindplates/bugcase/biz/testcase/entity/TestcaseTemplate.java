package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.common.constants.ColumnsDef;
import com.mindplates.bugcase.biz.common.entity.CommonEntity;
import com.mindplates.bugcase.biz.project.entity.Project;
import lombok.*;

import javax.persistence.*;


@Entity
@Builder
@Table(name = "testcase_template")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestcaseTemplate extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM_TYPE__PROJECT"))
    private Project project;

}
