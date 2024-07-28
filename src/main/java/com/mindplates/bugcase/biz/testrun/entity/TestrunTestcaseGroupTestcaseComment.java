package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_testcase_group_testcase_id", foreignKey = @ForeignKey(name = "FK_TTGTC__TESTRUN_TESTCASE_GROUP_TESTCASE"))
    private TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase;

    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_TTGTC_COMMENT__USER"))
    private User user;

    @Column(columnDefinition = "text", name = "comment")
    private String comment;


}
