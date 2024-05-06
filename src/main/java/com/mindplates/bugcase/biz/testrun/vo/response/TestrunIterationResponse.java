package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunIterationDTO;
import com.mindplates.bugcase.common.code.TestrunIterationTimeTypeCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterSelectRuleCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterTypeCode;
import java.util.ArrayList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunIterationResponse {

    private Long id;
    private String name;
    private String description;
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
    private TestrunIterationUserFilterTypeCode testrunIterationUserFilterType;
    private TestrunIterationUserFilterSelectRuleCode testrunIterationUserFilterSelectRule;
    private Integer filteringUserCount;
    private Integer filteringUserCursor;
    private List<Long> currentFilteringUserIds;
    private Boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private List<TestrunUserResponse> testrunUsers;
    private List<TestrunTestcaseGroupResponse> testcaseGroups;
    private Integer testcaseCount;
    private Integer testrunUserCount;
    private List<Long> profileIds;
    private List<TestrunHookResponse> hooks;

    public TestrunIterationResponse(TestrunIterationDTO testrunIteration) {
        this.id = testrunIteration.getId();
        this.name = testrunIteration.getName();
        this.description = testrunIteration.getDescription();
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
        this.testrunIterationUserFilterType = testrunIteration.getTestrunIterationUserFilterType();
        this.testrunIterationUserFilterSelectRule = testrunIteration.getTestrunIterationUserFilterSelectRule();
        this.filteringUserCount = testrunIteration.getFilteringUserCount();
        this.filteringUserCursor = testrunIteration.getFilteringUserCursor();
        this.currentFilteringUserIds = testrunIteration.getCurrentFilteringUserIds();
        this.deadlineClose = testrunIteration.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrunIteration.getAutoTestcaseNotAssignedTester();
        this.testcaseCount = testrunIteration.getTestcaseCount();
        this.testrunUserCount = testrunIteration.getTestrunUserCount();

        if (testrunIteration.getProfiles() != null && !testrunIteration.getProfiles().isEmpty()) {
            this.profileIds = testrunIteration.getProfiles()
                .stream()
                .map(testrunProfileDTO -> testrunProfileDTO.getProfile().getId()).collect(Collectors.toList());
        } else {
            this.profileIds = new ArrayList<>();
        }

        if (testrunIteration.getTestrunUsers() != null && !testrunIteration.getTestrunUsers().isEmpty()) {
            this.testrunUsers = testrunIteration.getTestrunUsers().stream().map(TestrunUserResponse::new).collect(Collectors.toList());
        }

        if (testrunIteration.getTestcaseGroups() != null && !testrunIteration.getTestcaseGroups().isEmpty()) {
            this.testcaseGroups = testrunIteration.getTestcaseGroups().stream().map(TestrunTestcaseGroupResponse::new).collect(Collectors.toList());
        }

        if (testrunIteration.getHooks() != null && !testrunIteration.getHooks().isEmpty()) {
            this.hooks = testrunIteration.getHooks().stream().map(TestrunHookResponse::new).collect(Collectors.toList());
        }
    }


}
