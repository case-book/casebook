package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "testrun_testcase_group_testcase")
public class TestrunTestcaseGroupTestcase extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_testcase_group_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_GROUP__TESTRUN"))
    private TestrunTestcaseGroup testrunTestcaseGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_GROUP__TESTRUN"))
    private Testcase testcase;

}
