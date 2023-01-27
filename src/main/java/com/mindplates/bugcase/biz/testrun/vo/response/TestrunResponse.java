package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.common.code.TestrunCreationTypeCode;
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
public class TestrunResponse {

    private Long id;
    private String seqId;
    private String name;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private boolean opened;
    private int totalTestcaseCount;
    private int passedTestcaseCount;
    private int failedTestcaseCount;
    private int untestableTestcaseCount;
    private String projectName;
    private List<TestrunUserResponse> testrunUsers;
    private List<TestrunTestcaseGroupResponse> testcaseGroups;
    private TestrunCreationTypeCode creationType;
    private String days;
    private Boolean onHoliday;
    private LocalTime startTime;
    private Integer durationHours;
    private Boolean reserveExpired;

    public TestrunResponse(TestrunDTO testrun) {
        this.id = testrun.getId();
        this.seqId = testrun.getSeqId();
        this.name = testrun.getName();
        this.description = testrun.getDescription();
        this.startDateTime = testrun.getStartDateTime();
        this.endDateTime = testrun.getEndDateTime();
        this.opened = testrun.isOpened();
        this.totalTestcaseCount = testrun.getTotalTestcaseCount();
        this.passedTestcaseCount = testrun.getPassedTestcaseCount();
        this.failedTestcaseCount = testrun.getFailedTestcaseCount();
        this.untestableTestcaseCount = testrun.getUntestableTestcaseCount();
        this.projectName = testrun.getProject().getName();
        this.creationType = testrun.getCreationType();
        this.days = testrun.getDays();
        this.onHoliday = testrun.getOnHoliday();
        this.startTime = testrun.getStartTime();
        this.durationHours = testrun.getDurationHours();
        this.reserveExpired = testrun.getReserveExpired();

        if (testrun.getTestrunUsers() != null && !testrun.getTestrunUsers().isEmpty()) {
            this.testrunUsers = testrun.getTestrunUsers().stream().map(TestrunUserResponse::new).collect(Collectors.toList());
        }

        if (testrun.getTestcaseGroups() != null && !testrun.getTestcaseGroups().isEmpty()) {
            this.testcaseGroups = testrun.getTestcaseGroups().stream().map(TestrunTestcaseGroupResponse::new).collect(Collectors.toList());
        }

    }


}
