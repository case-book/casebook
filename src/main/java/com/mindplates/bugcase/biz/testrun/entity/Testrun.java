package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Builder
@Table(name = "testrun", indexes = {@Index(name = "IDX_TESTRUN_PROJECT_ID", columnList = "project_id"),
        @Index(name = "IDX_TESTRUN_PROJECT_ID_END_DATE_TIME_ID", columnList = "project_id,end_date_time,id"),
        @Index(name = "IDX_TESTRUN_PROJECT_ID_START_DATE_TIME_ID", columnList = "project_id,start_date_time,id")})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Testrun extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seq_id", length = ColumnsDef.CODE)
    private String seqId;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @OneToMany(mappedBy = "testrun", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestrunUser> testrunUsers;

    @OneToMany(mappedBy = "testrun", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestrunTestcaseGroup> testcaseGroups;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTRUN__PROJECT"))
    private Project project;

    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    @Column(name = "opened")
    private boolean opened;

    @Column(name = "total_testcase_count")
    private int totalTestcaseCount;

    @Column(name = "passed_testcase_count")
    private int passedTestcaseCount;

    @Column(name = "failed_testcase_count")
    private int failedTestcaseCount;

    @Column(name = "untestable_testcase_count")
    private int untestableTestcaseCount;

    @Column(name = "closed_date")
    private LocalDateTime closedDate;

    @Column(name = "days", length = ColumnsDef.CODE)
    private String days;

    @Column(name = "exclude_holiday")
    private Boolean excludeHoliday;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "reserve_expired")
    private Boolean reserveExpired;

    @Column(name = "reserve_result_id")
    private Long reserveResultId;

    @Column(name = "deadline_close")
    private Boolean deadlineClose;

}
