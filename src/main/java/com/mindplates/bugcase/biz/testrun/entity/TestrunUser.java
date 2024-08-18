package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.Duration;
import java.time.LocalDateTime;
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
@Table(name = "testrun_user")
public class TestrunUser extends CommonEntity implements Cloneable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO FK_USER__TESTRUN 삭제
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_USER__USER"))
    private User user;

    // TODO FK_TESTRUN__USER 삭제
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_USER__TESTRUN"))
    private Testrun testrun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_reservation_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_USER__TESTRUN_RESERVATION"))
    private TestrunReservation testrunReservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_iteration_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_USER__TESTRUN_ITERATION"))
    private TestrunIteration testrunIteration;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public TestrunUser cloneEntity() {
        try {
            TestrunUser copiedTestrunUser = (TestrunUser) this.clone();
            copiedTestrunUser.setId(null);
            return copiedTestrunUser;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported for Testrun", e);
        }
    }
}
