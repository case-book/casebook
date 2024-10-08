package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.common.code.TestrunIterationTimeTypeCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterSelectRuleCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestrunIterationDTO extends CommonDTO implements IDTO<TestrunIteration> {

    private Long id;
    private String name;
    private String description;
    private ProjectDTO project;
    private LocalDateTime reserveStartDateTime;
    private LocalDateTime reserveEndDateTime;
    private TestrunIterationTimeTypeCode testrunIterationTimeType;
    private Boolean excludeHoliday;
    private Integer durationHours;
    private Boolean expired;
    private String days;
    private LocalTime startTime;
    private Integer date;
    private Integer week;
    private Integer day;
    private Boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private Boolean addConnectedSequenceTestcase;
    private Boolean assignSequenceTestcaseSameTester;
    private TestrunIterationUserFilterTypeCode testrunIterationUserFilterType;
    private TestrunIterationUserFilterSelectRuleCode testrunIterationUserFilterSelectRule;
    private Integer filteringUserCount;
    private Integer filteringUserCursor;
    private List<Long> currentFilteringUserIds;
    private Integer testcaseGroupCount;
    private Integer testcaseCount;
    private Long testrunUserCount;

    private List<TestrunUserDTO> testrunUsers;
    private List<TestrunTestcaseGroupDTO> testcaseGroups;
    private List<TestrunProfileDTO> profiles;
    private List<TestrunHookDTO> hooks;
    private List<TestrunMessageChannelDTO> messageChannels;

    public TestrunIterationDTO(TestrunIteration testrunIteration) {
        this.id = testrunIteration.getId();
        this.name = testrunIteration.getName();
        this.description = testrunIteration.getDescription();
        if (testrunIteration.getProject() != null) {
            this.project = ProjectDTO.builder().id(testrunIteration.getProject().getId()).build();
        }
        this.reserveStartDateTime = testrunIteration.getReserveStartDateTime();
        this.reserveEndDateTime = testrunIteration.getReserveEndDateTime();
        this.testrunIterationTimeType = testrunIteration.getTestrunIterationTimeType();
        this.excludeHoliday = testrunIteration.getExcludeHoliday();
        this.durationHours = testrunIteration.getDurationHours();
        this.expired = testrunIteration.getExpired();
        this.days = testrunIteration.getDays();
        this.startTime = testrunIteration.getStartTime();
        this.date = testrunIteration.getDate();
        this.week = testrunIteration.getWeek();
        this.day = testrunIteration.getDay();
        this.deadlineClose = testrunIteration.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrunIteration.getAutoTestcaseNotAssignedTester() != null && testrunIteration.getAutoTestcaseNotAssignedTester();
        this.addConnectedSequenceTestcase = testrunIteration.getAddConnectedSequenceTestcase();
        this.assignSequenceTestcaseSameTester = testrunIteration.getAssignSequenceTestcaseSameTester();
        this.testrunIterationUserFilterType = testrunIteration.getTestrunIterationUserFilterType();
        this.testrunIterationUserFilterSelectRule = testrunIteration.getTestrunIterationUserFilterSelectRule();
        this.filteringUserCount = testrunIteration.getFilteringUserCount();
        this.filteringUserCursor = testrunIteration.getFilteringUserCursor();
        this.currentFilteringUserIds = testrunIteration.getCurrentFilteringUserIds();
        this.testcaseGroupCount = Optional.ofNullable(testrunIteration.getTestcaseGroupCount()).orElse(0);
        this.testcaseCount = Optional.ofNullable(testrunIteration.getTestcaseCount()).orElse(0);
        if (testrunIteration.getTestrunUserCount() != null) {
            this.testrunUserCount = testrunIteration.getTestrunUserCount().longValue();
        }

        if (testrunIteration.getTestrunUsers() != null) {
            this.testrunUserCount = (long) testrunIteration.getTestrunUsers().size();
        }

        if (testrunIteration.getProfiles() != null) {
            this.profiles = testrunIteration.getProfiles().stream().map(TestrunProfileDTO::new).collect(Collectors.toList());
        }

        if (testrunIteration.getHooks() != null) {
            this.hooks = testrunIteration.getHooks().stream().map(TestrunHookDTO::new).collect(Collectors.toList());
        }

        if (testrunIteration.getMessageChannels() != null) {
            this.messageChannels = testrunIteration.getMessageChannels().stream().map(TestrunMessageChannelDTO::new).collect(Collectors.toList());
        }
    }

    public TestrunIterationDTO(TestrunIteration testrunIteration, boolean detail) {
        this(testrunIteration);
        if (detail) {
            testrunUsers = testrunIteration.getTestrunUsers().stream().map(TestrunUserDTO::new).collect(Collectors.toList());
            testcaseGroups = testrunIteration.getTestcaseGroups().stream().map(TestrunTestcaseGroupDTO::new).collect(Collectors.toList());
        }
    }

    @Override
    public TestrunIteration toEntity() {
        TestrunIteration testrunIteration = TestrunIteration.builder()
            .id(id)
            .name(name)
            .description(description)
            .project(ProjectDTO.builder().id(project.getId()).build().toEntity())
            .reserveStartDateTime(reserveStartDateTime)
            .reserveEndDateTime(reserveEndDateTime)
            .testrunIterationTimeType(testrunIterationTimeType)
            .excludeHoliday(excludeHoliday)
            .durationHours(durationHours)
            .expired(expired)
            .days(days)
            .startTime(startTime)
            .date(date)
            .week(week)
            .day(day)
            .deadlineClose(deadlineClose)
            .autoTestcaseNotAssignedTester(autoTestcaseNotAssignedTester)
            .addConnectedSequenceTestcase(addConnectedSequenceTestcase)
            .assignSequenceTestcaseSameTester(assignSequenceTestcaseSameTester)
            .testrunIterationUserFilterType(testrunIterationUserFilterType)
            .testrunIterationUserFilterSelectRule(testrunIterationUserFilterSelectRule)
            .filteringUserCount(filteringUserCount)
            .filteringUserCursor(filteringUserCursor)
            .currentFilteringUserIds(currentFilteringUserIds)
            .testcaseGroupCount(testcaseGroupCount)
            .testcaseCount(testcaseCount)
            .build();

        if (testrunUsers != null) {
            testrunIteration.setTestrunUsers(testrunUsers.stream().map(testrunUserDTO -> testrunUserDTO.toEntity(testrunIteration)).collect(Collectors.toList()));
        }

        if (profiles != null) {
            testrunIteration.setProfiles(profiles.stream().map(testrunProfileDTO -> testrunProfileDTO.toEntity(testrunIteration)).collect(Collectors.toList()));
        }

        if (hooks != null) {
            testrunIteration.setHooks(hooks.stream().map(testrunHookDTO -> testrunHookDTO.toEntity(testrunIteration)).collect(Collectors.toList()));
        }

        if (messageChannels != null) {
            testrunIteration.setMessageChannels(messageChannels.stream().map(testrunMessageChannelDTO -> testrunMessageChannelDTO.toEntity(testrunIteration)).collect(Collectors.toList()));
        }

        if (testcaseGroups != null) {
            testrunIteration.setTestcaseGroups(testcaseGroups.stream().map(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.toEntity(testrunIteration)).collect(Collectors.toList()));
        }

        return testrunIteration;


    }
}
