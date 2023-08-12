package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testrun.dto.TestrunIterationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.TestrunIterationTimeTypeCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterSelectRuleCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterTypeCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import com.mindplates.bugcase.framework.converter.LongListConverter;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Builder
@Table(name = "testrun_iteration", indexes = {@Index(name = "IDX_TESTRUN_PROJECT_ID", columnList = "project_id"),
    @Index(name = "IDX_TESTRUN_PROJECT_ID_END_DATE_TIME_ID", columnList = "project_id,reserve_end_date_time,id")})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestrunIteration extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunIteration", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<TestrunUser> testrunUsers;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunIteration", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<TestrunTestcaseGroup> testcaseGroups;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTRUN__PROJECT"))
    private Project project;

    @Column(name = "reserve_start_date_time")
    private LocalDateTime reserveStartDateTime;

    @Column(name = "reserve_end_date_time")
    private LocalDateTime reserveEndDateTime;

    @Column(name = "testrun_iteration_time_type")
    private TestrunIterationTimeTypeCode testrunIterationTimeType;

    @Column(name = "exclude_holiday")
    private Boolean excludeHoliday;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "expired")
    private Boolean expired;

    @Column(name = "deadline_close")
    private Boolean deadlineClose;

    @Column(name = "start_time")
    private LocalTime startTime;

    /* 요일별 반복 반복 룰 */
    @Column(name = "days", length = ColumnsDef.CODE)
    private String days;

    /* 날짜별 반복 룰 */
    @Column(name = "date")
    private Integer date; // 첫번째 워킹 데이=-2(미구현), 매월 말일=-1, 매월 1일=1, 미설정=null

    /* 주/요일별 반복 룰 */
    @Column(name = "week")
    private Integer week; // 마지막주 -1

    @Column(name = "day")
    private Integer day;

    /* 테스트런 유저 필터 조건 */
    @Column(name = "testrun_iteration_user_filter_type")
    private TestrunIterationUserFilterTypeCode testrunIterationUserFilterType;

    @Column(name = "testrun_iteration_user_filter_select_rule")
    private TestrunIterationUserFilterSelectRuleCode testrunIterationUserFilterSelectRule;

    @Column(name = "filtering_user_count")
    private Integer filteringUserCount;

    // testrunIterationUserFilterType=TESTRUN, testrunIterationUserFilterSelectRule=RANDOM인 경우
    // 데이터 미사용
    // testrunIterationUserFilterType=TESTRUN, testrunIterationUserFilterSelectRule=SEQ인 경우
    // 초기 0으로 시작, 테스트런 반복 생성 마다 +filteringUserCount만큼 증가
    // testrunIterationUserFilterType=WEEKLY, testrunIterationUserFilterSelectRule=RANDOM인 경우
    // 생성시의 주번호 저장, 주 번호가 변경되는 경우, currentFilteringUserIds의 목록을 filteringUserCount의 랜덤 사용자 ID로 저장, 주 번호가 그대로인 경우, currentFilteringUserIds를 테스터로 사용
    // testrunIterationUserFilterType=WEEKLY, testrunIterationUserFilterSelectRule=SEQ인 경우
    // 생성시의 주번호 저장, 주 번호가 변경되는 경우, currentFilteringUserIds의 목록의 마지막 사용자 ID 다음의 테스터 인덱스의 사용자부터 filteringUserCount 만큼 증가한 INDEX 사용자로 currentFilteringUserIds에 저장, 주 번호가 그대로인 경우, currentFilteringUserIds를 테스터로 사용
    // MONTHLY인 경우, WEEKLY와 동일하게 처리하되, filteringUserCursor에 월 번호 저장
    @Column(name = "filtering_user_cursor")
    private Integer filteringUserCursor;

    @Column(name = "current_filtering_user_ids", length = ColumnsDef.TEXT)
    @Convert(converter = LongListConverter.class)
    private List<Long> currentFilteringUserIds;

    @Column(name = "testcase_group_count")
    private Integer testcaseGroupCount;

    @Column(name = "testcase_count")
    private Integer testcaseCount;


    public void updateInfo(TestrunIterationDTO testrunIteration) {
        this.expired = false;
        this.name = testrunIteration.getName();
        this.description = testrunIteration.getDescription();
        this.reserveStartDateTime = testrunIteration.getReserveStartDateTime();
        this.reserveEndDateTime = testrunIteration.getReserveEndDateTime();
        this.testrunIterationTimeType = testrunIteration.getTestrunIterationTimeType();
        this.excludeHoliday = testrunIteration.getExcludeHoliday();
        this.durationHours = testrunIteration.getDurationHours();
        this.deadlineClose = testrunIteration.getDeadlineClose();
        this.startTime = testrunIteration.getStartTime();
        this.days = testrunIteration.getDays();
        this.date = testrunIteration.getDate();
        this.week = testrunIteration.getWeek();
        this.day = testrunIteration.getDay();
        this.testrunIterationUserFilterType = testrunIteration.getTestrunIterationUserFilterType();
        this.testrunIterationUserFilterSelectRule = testrunIteration.getTestrunIterationUserFilterSelectRule();
        this.filteringUserCount = testrunIteration.getFilteringUserCount();
        this.testcaseGroupCount = testrunIteration.getTestcaseGroupCount();
        this.testcaseCount = testrunIteration.getTestcaseCount();
    }

    public void updateTester(List<TestrunUserDTO> testrunUsers) {
        // 삭제된 테스터 제거
        this.testrunUsers.removeIf(testrunUser -> testrunUsers
            .stream()
            .noneMatch(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(testrunUser.getUser().getId())));

        // 추가된 테스터 추가
        this.testrunUsers.addAll(testrunUsers
            .stream()
            .filter(testrunUserDTO -> testrunUsers
                .stream()
                .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunUserDTO.getUser().getId())))
            .map(testrunUserDTO -> TestrunUser.builder()
                .user(User.builder().id(testrunUserDTO.getUser().getId()).build())
                .testrunIteration(this)
                .build())
            .collect(Collectors.toList()));
    }
}
