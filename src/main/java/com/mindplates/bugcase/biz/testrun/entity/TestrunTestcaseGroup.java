package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "testrun_testcase_group")
public class TestrunTestcaseGroup extends CommonEntity implements Cloneable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP__TESTRUN"))
    private Testrun testrun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_reservation_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP__TESTRUN_RESERVATION"))
    private TestrunReservation testrunReservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_iteration_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP__TESTRUN_ITERATION"))
    private TestrunIteration testrunIteration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_group_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP__TESTCASE_GROUP"))
    private TestcaseGroup testcaseGroup;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunTestcaseGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunTestcaseGroupTestcase> testcases;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public TestrunTestcaseGroup cloneEntity() {
        try {
            TestrunTestcaseGroup copiedTestrunTestcaseGroup = (TestrunTestcaseGroup) this.clone();
            copiedTestrunTestcaseGroup.setId(null);
            return copiedTestrunTestcaseGroup;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported for Testrun", e);
        }
    }

}
