package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "testrun_testcase_group_testcase_comment")
public class TestrunTestcaseGroupTestcaseComment extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_testcase_group_testcase_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP_TESTCASE_COMMENT__TESTRUN_TESTCASE_GROUP_TESTCASE"))
    private TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase;

    @Column(columnDefinition = "text", name = "comment")
    private String comment;


}
