package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

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
    @JoinColumn(name = "testrun_testcase_group_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP_TESTCASE__TESTRUN_TESTCASE_GROUP"))
    private TestrunTestcaseGroup testrunTestcaseGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP_TESTCASE__TESTCASE"))
    private Testcase testcase;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunTestcaseGroupTestcase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunTestcaseGroupTestcaseItem> testcaseItems;



}
