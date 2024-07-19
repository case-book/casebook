package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
import java.util.List;
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
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

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
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_RESERVATION__PROJECT"))
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

    @Column(name = "auto_testcase_not_assigned_tester")
    private Boolean autoTestcaseNotAssignedTester;

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

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "testrunReservation")
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("itemOrder ASC")
    private List<TestrunProfile> profiles;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "testrunReservation")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunHook> hooks;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunReservation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunMessageChannel> messageChannels;

    public TestrunReservation(Long id,
        String name,
        String description,
        long projectId,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Boolean expired,
        Boolean deadlineClose,
        Boolean autoTestcaseNotAssignedTester,
        Integer testcaseGroupCount,
        Integer testcaseCount,
        Long testrunId,
        Boolean selectCreatedTestcase,
        Boolean selectUpdatedTestcase) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.project = Project.builder().id(projectId).build();
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.expired = expired;
        this.deadlineClose = deadlineClose;
        this.autoTestcaseNotAssignedTester = autoTestcaseNotAssignedTester;
        this.testcaseGroupCount = testcaseGroupCount;
        this.testcaseCount = testcaseCount;
        this.testrun = Testrun.builder().id(testrunId).build();
        this.selectCreatedTestcase = selectCreatedTestcase;
        this.selectUpdatedTestcase = selectUpdatedTestcase;

    }

    public void updateTestcaseCount() {
        int testcaseGroupCountResult = 0;
        int testcaseCountResult = 0;
        if (this.testcaseGroups != null) {
            testcaseGroupCountResult += this.testcaseGroups.size();
            for (TestrunTestcaseGroup testrunTestcaseGroup : this.testcaseGroups) {
                testrunTestcaseGroup.setTestrunReservation(this);
                if (testrunTestcaseGroup.getTestcases() != null) {
                    testcaseCountResult += testrunTestcaseGroup.getTestcases().size();
                    for (TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                        testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
                    }
                }
            }
        }
        this.testcaseGroupCount = testcaseGroupCountResult;
        this.testcaseCount = testcaseCountResult;
    }

    public void updateInfo(TestrunReservation testrunReservation) {
        this.expired = false;
        this.name = testrunReservation.getName();
        this.description = testrunReservation.getDescription();
        this.startDateTime = testrunReservation.getStartDateTime();
        this.endDateTime = testrunReservation.getEndDateTime();
        this.deadlineClose = testrunReservation.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrunReservation.getAutoTestcaseNotAssignedTester() != null && testrunReservation.getAutoTestcaseNotAssignedTester();
        this.profiles.clear();
        this.profiles.addAll(testrunReservation.getProfiles());
        this.hooks.removeIf(hook -> testrunReservation.hooks.stream().noneMatch(targetHook -> targetHook.getId() != null && targetHook.getId().equals(hook.getId())));
        if (testrunReservation.hooks != null) {
            this.hooks.addAll(testrunReservation.hooks.stream().filter(targetHook -> targetHook.getId() == null).collect(Collectors.toList()));
        }

        if (this.hooks != null) {
            this.hooks.stream().filter(targetHook -> targetHook.getId() != null).forEach(hook -> {
                testrunReservation.getHooks()
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

    }

    public void updateTestrunUsers(List<TestrunUser> newTestrunUsers) {
        // 삭제된 테스터 제거
        this.testrunUsers.removeIf(testrunUser -> newTestrunUsers
            .stream()
            .noneMatch(newTestrunUser -> newTestrunUser.getUser().getId().equals(testrunUser.getUser().getId())));

        // 추가된 테스터 추가
        this.testrunUsers.addAll(
            newTestrunUsers
                .stream()
                .filter(newTestrunUser -> this.testrunUsers.size() < 1 || this.testrunUsers
                    .stream()
                    .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(newTestrunUser.getUser().getId())))
                .map(newTestrunUser -> TestrunUser.builder()
                    .user(User.builder().id(newTestrunUser.getUser().getId()).build())
                    .testrunReservation(this)
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

        // 존재하는 테스트런 테스트케이스 그룹에 추가된 테스트런 테이스케이스 추가
        if (newTestcaseGroups != null) {

            newTestcaseGroups.stream()
                .filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getId() != null)
                .forEach(testrunTestcaseGroupDTO -> {
                    TestrunTestcaseGroup targetTestcaseGroup = this.testcaseGroups.stream().filter(
                        testrunTestcaseGroup -> testrunTestcaseGroup.getId()
                            .equals(testrunTestcaseGroupDTO.getId())).findAny().orElse(null);

                    if (targetTestcaseGroup != null
                        && testrunTestcaseGroupDTO.getTestcases() != null) {
                        testrunTestcaseGroupDTO.getTestcases()
                            .stream()
                            .filter(newTestrunTestcaseGroup -> newTestrunTestcaseGroup.getId() == null)
                            .forEach(newTestrunTestcaseGroup -> {
                                newTestrunTestcaseGroup.setTestrunTestcaseGroup(targetTestcaseGroup);
                                targetTestcaseGroup.getTestcases().add(newTestrunTestcaseGroup);
                            });
                    }
                });

            // 추가된 테스트런 테스트케이스 그룹 추가
            newTestcaseGroups.stream()
                .filter(newTestrunTestCaseGroup -> newTestrunTestCaseGroup.getId() == null)
                .forEach(newTestrunTestCaseGroup -> {
                    newTestrunTestCaseGroup.setTestrunReservation(this);
                    this.testcaseGroups.add(newTestrunTestCaseGroup);
                });
        }
    }

    public void updateTestcaseAndGroupCount() {
        this.testcaseGroupCount = this.testcaseGroups.size();
        this.testcaseCount = this.testcaseGroups
            .stream()
            .map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0)
            .reduce(0, Integer::sum);
    }
}
