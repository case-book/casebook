package com.mindplates.bugcase.biz.testrun.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunProfileDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
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
import javax.persistence.OrderBy;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;

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

    @Column(name = "auto_testcase_not_assigned_tester")
    private Boolean autoTestcaseNotAssignedTester;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrun", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunUser> testrunUsers;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrun", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunTestcaseGroup> testcaseGroups;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "testrun")
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("itemOrder ASC")
    private List<TestrunProfile> profiles;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "testrun")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunHook> hooks;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrun", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunMessageChannel> messageChannels;

    public Testrun(Long id, String seqId, String name, String description, long projectId,
        LocalDateTime startDateTime, LocalDateTime endDateTime, boolean opened, int totalTestcaseCount,
        int passedTestcaseCount, int failedTestcaseCount, int untestableTestcaseCount, LocalDateTime closedDate,
        String days, Boolean excludeHoliday, LocalTime startTime, Integer durationHours,
        Boolean reserveExpired, Long reserveResultId, Boolean deadlineClose, Boolean autoTestcaseNotAssignedTester) {
        this.id = id;
        this.seqId = seqId;
        this.name = name;
        this.description = description;
        this.project = Project.builder().id(projectId).build();
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.opened = opened;
        this.totalTestcaseCount = totalTestcaseCount;
        this.passedTestcaseCount = passedTestcaseCount;
        this.failedTestcaseCount = failedTestcaseCount;
        this.untestableTestcaseCount = untestableTestcaseCount;
        this.closedDate = closedDate;
        this.days = days;
        this.excludeHoliday = excludeHoliday;
        this.startTime = startTime;
        this.durationHours = durationHours;
        this.reserveExpired = reserveExpired;
        this.reserveResultId = reserveResultId;
        this.deadlineClose = deadlineClose;
        this.autoTestcaseNotAssignedTester = autoTestcaseNotAssignedTester;
    }

    public void update(TestrunDTO updateTestrun) {
        updateInfo(updateTestrun);
        updateTestrunUsers(updateTestrun.getTestrunUsers());
        updateTestcaseGroups(updateTestrun.getTestcaseGroups());
    }

    public void updateInfo(TestrunDTO updateTestrun) {
        this.name = (updateTestrun.getName());
        this.description = (updateTestrun.getDescription());
        this.startDateTime = (updateTestrun.getStartDateTime());
        this.endDateTime = (updateTestrun.getEndDateTime());
        this.opened = (updateTestrun.isOpened());
        this.days = (updateTestrun.getDays());
        this.excludeHoliday = (updateTestrun.getExcludeHoliday());
        this.startTime = (updateTestrun.getStartTime());
        this.durationHours = (updateTestrun.getDurationHours());
        this.reserveExpired = (updateTestrun.getReserveExpired());
        this.deadlineClose = (updateTestrun.getDeadlineClose());
        this.autoTestcaseNotAssignedTester = updateTestrun.getAutoTestcaseNotAssignedTester();
        this.profiles.clear();
        this.profiles.addAll(updateTestrun.getProfiles().stream().map(TestrunProfileDTO::toEntity).collect(Collectors.toList()));
        this.hooks.removeIf(hook -> updateTestrun.getHooks().stream().noneMatch(targetHook -> targetHook.getId() != null && targetHook.getId().equals(hook.getId())));
        if (updateTestrun.getHooks() != null) {
            this.hooks.addAll(updateTestrun.getHooks().stream().filter(targetHook -> targetHook.getId() == null).map(TestrunHookDTO::toEntity).collect(Collectors.toList()));
        }
        if (this.hooks != null) {
            this.hooks.stream().filter(targetHook -> targetHook.getId() != null).forEach(hook -> {
                updateTestrun.getHooks()
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
        }

        this.messageChannels.removeIf(
            messageChannel -> updateTestrun.getMessageChannels().stream()
                .noneMatch(targetMessageChannel -> targetMessageChannel.getId() != null && targetMessageChannel.getId().equals(messageChannel.getId())));
        if (updateTestrun.getMessageChannels() != null) {
            // testrun의 messageChannels를 반복하면서, ID가 있으면 업데이트, 없으면 추가
            this.messageChannels.addAll(
                updateTestrun.getMessageChannels().stream().filter(targetMessageChannel -> targetMessageChannel.getId() == null).map(TestrunMessageChannelDTO::toEntity).collect(Collectors.toList()));
        }

    }

    public void updateTestrunUsers(List<TestrunUserDTO> testrunUsers) {
        // 삭제된 테스트 제거
        this.testrunUsers.removeIf(testrunUser -> testrunUsers
            .stream()
            .noneMatch(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(testrunUser.getUser().getId())));
        // 추가된 테스터 추가
        this.testrunUsers.addAll(
            testrunUsers
                .stream()
                .filter(testrunUserDTO -> this.testrunUsers
                    .stream()
                    .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(testrunUserDTO.getUser().getId())))
                .map(testrunUserDTO -> TestrunUser.builder()
                    .user(User.builder()
                        .id(testrunUserDTO.getUser().getId())
                        .build())
                    .testrun(this)
                    .build())
                .collect(Collectors.toList()));
    }

    public void updateTestcaseGroups(List<TestrunTestcaseGroupDTO> updateTestcaseGroups) {
        // 삭제된 테스트런 테스트케이스 그룹 제거
        this.testcaseGroups.removeIf(testrunTestcaseGroup -> updateTestcaseGroups
            .stream()
            .filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null)
            .noneMatch(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId().equals(testrunTestcaseGroup.getId())));

        // 삭제된 테스트런 테스트케이스 그룹 테스트케이스 제거
        for (TestrunTestcaseGroup testcaseGroup : this.testcaseGroups) {
            TestrunTestcaseGroupDTO updateTestrunTestcaseGroup = updateTestcaseGroups
                .stream()
                .filter(testrunTestcaseGroup -> testrunTestcaseGroup.getId() != null)
                .filter(testrunTestcaseGroup -> testrunTestcaseGroup.getId().equals(testcaseGroup.getId())).findAny().orElse(null);

            if (testcaseGroup.getTestcases() != null) {
                testcaseGroup.getTestcases().removeIf(testcase -> {
                    if (updateTestrunTestcaseGroup != null) {
                        return updateTestrunTestcaseGroup.getTestcases()
                            .stream()
                            .noneMatch(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.getId().equals(testcase.getId()));
                    }
                    return true;
                });
            }
        }

        // 존재하는 테스트런 테스트케이스 그룹에 추가된 테스트런 테이스케이스 추가
        updateTestcaseGroups.stream()
            .filter(testrunTestcaseGroup -> testrunTestcaseGroup.getId() != null)
            .forEach(testrunTestcaseGroup -> {
                TestrunTestcaseGroup targetTestcaseGroup = this.testcaseGroups
                    .stream()
                    .filter(ttg -> ttg.getId().equals(testrunTestcaseGroup.getId()))
                    .findAny()
                    .orElse(null);

                if (targetTestcaseGroup != null && testrunTestcaseGroup.getTestcases() != null) {
                    testrunTestcaseGroup.getTestcases()
                        .stream()
                        .filter(testrunTestcaseGroupTestcase -> testrunTestcaseGroupTestcase.getId() == null)
                        .forEach(testrunTestcaseGroupTestcase -> {
                            TestrunTestcaseGroupTestcase addTestrunTestcaseGroupTestcase = testrunTestcaseGroupTestcase.toEntity();
                            addTestrunTestcaseGroupTestcase.setTestrunTestcaseGroup(targetTestcaseGroup);
                            addTestrunTestcaseGroupTestcase.setTestResult(TestResultCode.UNTESTED);
                            targetTestcaseGroup.getTestcases().add(addTestrunTestcaseGroupTestcase);
                        });
                }
            });

        // 추가된 테스트런 테스트케이스 그룹 추가
        updateTestcaseGroups.stream()
            .filter(testrunTestcaseGroup -> testrunTestcaseGroup.getId() == null)
            .forEach(testrunTestcaseGroup -> {
                TestrunTestcaseGroup testcaseGroup = testrunTestcaseGroup.toEntity();
                testcaseGroup.setTestrun(this);
                for (TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase : testcaseGroup.getTestcases()) {
                    testrunTestcaseGroupTestcase.setTestResult(TestResultCode.UNTESTED);
                }
                this.testcaseGroups.add(testcaseGroup);
            });
    }

    public void updateTestSummaryCount(TestrunTestcaseGroupTestcase targetTestrunTestcaseGroupTestcase, TestResultCode testResultCode) {
        if (!Objects.isNull(targetTestrunTestcaseGroupTestcase.getTestResult())) {
            if (targetTestrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.PASSED)) {
                this.passedTestcaseCount = this.passedTestcaseCount - 1;
            } else if (targetTestrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.FAILED)) {
                this.failedTestcaseCount = this.failedTestcaseCount - 1;
            } else if (targetTestrunTestcaseGroupTestcase.getTestResult().equals(TestResultCode.UNTESTABLE)) {
                this.untestableTestcaseCount = this.untestableTestcaseCount - 1;
            }
        }

        if (testResultCode.equals(TestResultCode.PASSED)) {
            this.passedTestcaseCount = this.passedTestcaseCount + 1;
        } else if (testResultCode.equals(TestResultCode.FAILED)) {
            this.failedTestcaseCount = this.failedTestcaseCount + 1;
        } else if (testResultCode.equals(TestResultCode.UNTESTABLE)) {
            this.untestableTestcaseCount = this.untestableTestcaseCount + 1;
        }
    }

    @JsonIgnore
    public boolean isAllTestcaseDone() {
        return this.totalTestcaseCount <= this.passedTestcaseCount + this.failedTestcaseCount + this.untestableTestcaseCount;
    }

    public void validateOpened() {
        if (!this.opened) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "project.already.closed");
        }
    }

    public int calculateTotalTestcaseCount() {
        return this.testcaseGroups.stream()
            .map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0)
            .reduce(0, Integer::sum);
    }

    public boolean containsTester(Long userId) {
        return testcaseGroups
            .stream()
            .anyMatch(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases()
                .stream()
                .anyMatch(testrunTestcaseGroupTestcase -> userId.equals(testrunTestcaseGroupTestcase.getTester() != null ? testrunTestcaseGroupTestcase.getTester().getId() : null)));
    }

    public void initializeCreateInfo(int currentTestrunSeq) {
        this.seqId = "R" + currentTestrunSeq;
        this.opened = true;
        this.totalTestcaseCount = calculateTotalTestcaseCount();
        this.passedTestcaseCount = 0;
        this.failedTestcaseCount = 0;
        this.untestableTestcaseCount = 0;
        if (!CollectionUtils.isEmpty(this.testrunUsers)) {
            this.testrunUsers.forEach(testrunUser -> testrunUser.setTestrun(this));
        }
        if (!CollectionUtils.isEmpty(this.testcaseGroups)) {
            this.testcaseGroups.forEach(testrunTestcaseGroup -> {
                testrunTestcaseGroup.setTestrun(this);
                if (!CollectionUtils.isEmpty(testrunTestcaseGroup.getTestcases())) {
                    testrunTestcaseGroup.getTestcases().forEach(testrunTestcaseGroupTestcase -> {
                        testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
                        if (!CollectionUtils.isEmpty(testrunTestcaseGroupTestcase.getTestcaseItems())) {
                            testrunTestcaseGroupTestcase.getTestcaseItems()
                                .forEach(testrunTestcaseGroupTestcaseItem -> testrunTestcaseGroupTestcaseItem.setTestrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase));
                        }
                    });
                }
            });
        }
    }

    public void initializeTestGroupAndTestCase(Map<Long, Testcase> projectTestcaseMap, Map<Long, List<TestcaseItem>> idTestcaseItemListMap, Map<Long, TestcaseTemplateItem> idTestcaseTemplateItemMap,
        Random random, Boolean autoTestcaseNotAssignedTester) {
        int currentSeq = random.nextInt(testrunUsers.size());
        for (TestrunTestcaseGroup testrunTestcaseGroup : this.testcaseGroups) {
            if (testrunTestcaseGroup.getTestcases() != null) {
                for (TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                    Testcase testcase = projectTestcaseMap.get(testrunTestcaseGroupTestcase.getTestcase().getId());
                    if (testcase == null) {
                        continue;
                    }
                    List<TestcaseItem> testcaseItems = idTestcaseItemListMap.get(testcase.getId());
                    testrunTestcaseGroupTestcase.setTestResult(TestResultCode.UNTESTED);
                    currentSeq = testrunTestcaseGroupTestcase.assignTester(project, new TestcaseDTO(testcase), testrunUsers, currentSeq, random, autoTestcaseNotAssignedTester);
                    if (testcaseItems != null) {
                        for (TestcaseItem testcaseItem : testcaseItems) {
                            if (testcaseItem.getValue() == null || Objects
                                .isNull(idTestcaseTemplateItemMap.get(testcaseItem.getTestcaseTemplateItem().getId()))) {
                                continue;
                            }
                            TestcaseTemplateItem testcaseTemplateItem = idTestcaseTemplateItemMap.get(testcaseItem.getTestcaseTemplateItem().getId());
                            currentSeq = testrunTestcaseGroupTestcase
                                .addTestCaseItem(testcaseTemplateItem, testrunTestcaseGroupTestcase, testcaseItem, random, testrunUsers, currentSeq);
                        }
                    }

                }
            }
        }
    }

    public List<TestrunHook> getTestrunHookList(TestrunHookTiming timing) {
        return this.hooks.stream().filter(hook -> hook.getTiming().equals(timing)).collect(Collectors.toList());
    }
}
