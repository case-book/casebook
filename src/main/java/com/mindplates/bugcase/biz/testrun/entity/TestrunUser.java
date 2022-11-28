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
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_USER__TESTRUN"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_TESTRUN__USER"))
    private Testrun testrun;

}
