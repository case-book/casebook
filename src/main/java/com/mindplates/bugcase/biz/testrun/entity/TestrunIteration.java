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
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_ITERATION__PROJECT"))
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

    @Column(name = "auto_testcase_not_assigned_tester")
    private Boolean autoTestcaseNotAssignedTester;

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

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "testrunIteration")
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("itemOrder ASC")
    private List<TestrunProfile> profiles;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "testrunIteration")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunHook> hooks;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunIteration", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunMessageChannel> messageChannels;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunIteration", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunUser> testrunUsers;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunIteration", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunTestcaseGroup> testcaseGroups;

    @Transient
    private Long testrunUserCount;

    public TestrunIteration(
        long id,
        String name,
        String description,
        long projectId,
        LocalDateTime reserveStartDateTime,
        LocalDateTime reserveEndDateTime,
        TestrunIterationTimeTypeCode testrunIterationTimeType,
        Boolean excludeHoliday,
        Integer durationHours,
        Boolean expired,
        String days,
        LocalTime startTime,
        Integer date,
        Integer week,
        Integer day,
        TestrunIterationUserFilterTypeCode testrunIterationUserFilterType,
        TestrunIterationUserFilterSelectRuleCode testrunIterationUserFilterSelectRule,
        Integer filteringUserCount,
        Integer testcaseGroupCount,
        Integer testcaseCount,
        Boolean deadlineClose,
        Boolean autoTestcaseNotAssignedTester,
        Long testrunUserCount
    ) {

        this.id = id;
        this.name = name;
        this.project = Project.builder().id(projectId).build();
        this.description = description;
        this.reserveStartDateTime = reserveStartDateTime;
        this.reserveEndDateTime = reserveEndDateTime;
        this.testrunIterationTimeType = testrunIterationTimeType;
        this.excludeHoliday = excludeHoliday;
        this.durationHours = durationHours;
        this.expired = expired;
        this.days = days;
        this.startTime = startTime;
        this.date = date;
        this.week = week;
        this.day = day;
        this.testrunIterationUserFilterType = testrunIterationUserFilterType;
        this.testrunIterationUserFilterSelectRule = testrunIterationUserFilterSelectRule;
        this.filteringUserCount = filteringUserCount;
        this.testcaseGroupCount = testcaseGroupCount;
        this.testcaseCount = testcaseCount;
        this.deadlineClose = deadlineClose;
        if (autoTestcaseNotAssignedTester != null) {
            this.autoTestcaseNotAssignedTester = autoTestcaseNotAssignedTester;
        } else {
            this.autoTestcaseNotAssignedTester = false;
        }
        this.testrunUserCount = testrunUserCount;
    }

    public void updateInfo(TestrunIteration testrunIteration) {
        this.expired = false;
        this.name = testrunIteration.getName();
        this.description = testrunIteration.getDescription();
        this.reserveStartDateTime = testrunIteration.getReserveStartDateTime();
        this.reserveEndDateTime = testrunIteration.getReserveEndDateTime();
        this.testrunIterationTimeType = testrunIteration.getTestrunIterationTimeType();
        this.excludeHoliday = testrunIteration.getExcludeHoliday();
        this.durationHours = testrunIteration.getDurationHours();
        this.deadlineClose = testrunIteration.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrunIteration.getAutoTestcaseNotAssignedTester() != null && testrunIteration.getAutoTestcaseNotAssignedTester();
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
        this.profiles.clear();
        this.profiles.addAll(testrunIteration.getProfiles());
        this.hooks.removeIf(hook -> testrunIteration.hooks.stream().noneMatch(targetHook -> targetHook.getId() != null && targetHook.getId().equals(hook.getId())));
        if (testrunIteration.hooks != null) {
            this.hooks.addAll(testrunIteration.hooks.stream().filter(targetHook -> targetHook.getId() == null).collect(Collectors.toList()));
        }
        this.hooks.stream().filter(targetHook -> targetHook.getId() != null).forEach(hook -> {
            testrunIteration.getHooks()
                .stream()
                .filter(targetHook -> targetHook.getId().equals(hook.getId())).findAny()
                .ifPresent(targetHook -> {
                    hook.setTiming(targetHook.getTiming());
                    hook.setName(targetHook.getName());
                    hook.setUrl(targetHook.getUrl());
                    hook.setMethod(targetHook.getMethod());
                    hook.setHeaders(targetHook.getHeaders());
                    hook.setBodies(targetHook.getBodies());
                    hook.setRetryCount(targetHook.getRetryCount());
                });
        });

        this.messageChannels.removeIf(messageChannel -> testrunIteration.messageChannels.stream()
            .noneMatch(targetMessageChannel -> targetMessageChannel.getId() != null && targetMessageChannel.getId().equals(messageChannel.getId())));
        if (testrunIteration.messageChannels != null) {
            // testrun의 messageChannels를 반복하면서, ID가 있으면 업데이트, 없으면 추가
            this.messageChannels.addAll(testrunIteration.messageChannels.stream().filter(targetMessageChannel -> targetMessageChannel.getId() == null).collect(Collectors.toList()));
        }
    }

    public void updateIterationInfo(TestrunIterationDTO testrunIteration) {
        if (testrunIteration.getFilteringUserCursor() != null) {
            this.filteringUserCursor = testrunIteration.getFilteringUserCursor();
        }
        if (testrunIteration.getExpired() != null) {
            this.expired = testrunIteration.getExpired();
        }

        if (testrunIteration.getCurrentFilteringUserIds() != null) {
            this.currentFilteringUserIds = testrunIteration.getCurrentFilteringUserIds();
        }
    }

    public void updateTester(List<TestrunUserDTO> testrunUsers) {
        // 삭제된 테스터 제거
        this.testrunUsers.removeIf(testrunUser -> testrunUsers
            .stream()
            .noneMatch(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(testrunUser.getUser().getId())));

        // 추가된 테스터 추가
        this.testrunUsers.addAll(testrunUsers
            .stream()
            .filter(testrunUserDTO -> this.testrunUsers.size() < 1 || this.testrunUsers
                .stream()
                .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunUserDTO.getUser().getId())))
            .map(testrunUserDTO -> TestrunUser.builder()
                .user(User.builder().id(testrunUserDTO.getUser().getId()).build())
                .testrunIteration(this)
                .build())
            .collect(Collectors.toList()));
    }

    public void updateTestcaseGroups(List<TestrunTestcaseGroup> newTestcaseGroups) {
        // 삭제된 테스트런 테스트케이스 그룹 제거
        this.testcaseGroups.removeIf(
            (testrunTestcaseGroup -> newTestcaseGroups.stream()
                .filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null)
                .noneMatch((testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId()
                    .equals(testrunTestcaseGroup.getId())))));

        // 삭제된 테스트런 테스트케이스 그룹 테스트케이스 제거
        for (TestrunTestcaseGroup testcaseGroup : this.testcaseGroups) {
            TestrunTestcaseGroup updateTestrunTestcaseGroup = newTestcaseGroups
                .stream()
                .filter(newTestrunTestcaseGroup -> newTestrunTestcaseGroup.getId() != null)
                .filter(newTestrunTestcaseGroup -> newTestrunTestcaseGroup.getId().equals(testcaseGroup.getId())).findAny().orElse(null);

            if (testcaseGroup.getTestcases() != null) {
                testcaseGroup.getTestcases().removeIf(testcase -> {
                    if (updateTestrunTestcaseGroup != null) {
                        return updateTestrunTestcaseGroup.getTestcases()
                            .stream()
                            .noneMatch(testrunTestcaseGroupTestcaseDTO -> testcase.getId().equals(testrunTestcaseGroupTestcaseDTO.getId()));
                    }
                    return true;
                });
            }
        }

        newTestcaseGroups.stream()
            .forEach(ttg -> {
                TestrunTestcaseGroup targetTestcaseGroup = this.testcaseGroups.stream()
                    .filter(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcaseGroup().getId().equals(ttg.getTestcaseGroup().getId())).findAny()
                    .orElse(null);
                if (targetTestcaseGroup == null) {
                    this.testcaseGroups.add(ttg);
                } else if (ttg.getTestcases() != null) {
                    ttg.getTestcases()
                        .stream()
                        .forEach(testrunTestcaseGroupTestcase -> {

                            TestrunTestcaseGroupTestcase testcase = targetTestcaseGroup.getTestcases()
                                .stream()
                                .filter(targetTestrunTestcaseGroupTestcase -> targetTestrunTestcaseGroupTestcase.getTestcase().getId()
                                    .equals(testrunTestcaseGroupTestcase.getTestcase().getId()))
                                .findAny().orElse(null);

                            if (testcase == null) {
                                testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(targetTestcaseGroup);
                                targetTestcaseGroup.getTestcases().add(testrunTestcaseGroupTestcase);
                            }

                        });
                }
            });
    }


}
