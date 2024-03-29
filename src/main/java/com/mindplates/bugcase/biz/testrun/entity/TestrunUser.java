package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "testrun_user")
public class TestrunUser extends CommonEntity {

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
}
