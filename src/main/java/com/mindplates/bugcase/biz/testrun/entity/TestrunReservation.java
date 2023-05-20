package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Builder
@Table(name = "testrun_reservation", indexes = {@Index(name = "IDX_TESTRUN_PROJECT_ID", columnList = "project_id"),
        @Index(name = "IDX_TESTRUN_PROJECT_ID_END_DATE_TIME_ID", columnList = "project_id,end_date_time,id")})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestrunReservation extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTRUN__PROJECT"))
    private Project project;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunReservation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<TestrunUser> testrunUsers;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunReservation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<TestrunTestcaseGroup> testcaseGroups;

    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    @Column(name = "expired")
    private Boolean expired;

    @Column(name = "deadline_close")
    private Boolean deadlineClose;

    @Column(name = "testcase_group_count")
    private Integer testcaseGroupCount;

    @Column(name = "testcase_count")
    private Integer testcaseCount;

    @OneToOne
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_RESERVATION__TESTRUN"))
    private Testrun testrun;

    @Comment("생성일자부터 예약된 시간까지 생성된 테스트케이스를 자동으로 추가하는지의 여부")
    @Column(name = "select_created_testcase")
    private Boolean selectCreatedTestcase;

    @Comment("생성일자부터 예약된 시간까지 수정된 테스트케이스를 자동으로 추가하는지의 여부")
    @Column(name = "select_updated_testcase")
    private Boolean selectUpdatedTestcase;

}
