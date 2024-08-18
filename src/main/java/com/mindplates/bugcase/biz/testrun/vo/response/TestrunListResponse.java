package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunListDTO;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunListResponse {

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
    private LocalDateTime closedDate;
    private String days;
    private Boolean excludeHoliday;
    private LocalTime startTime;
    private Integer durationHours;
    private Boolean reserveExpired;
    private Long reserveResultId;
    private Boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;

    public TestrunListResponse(TestrunDTO testrun) {
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
        this.closedDate = testrun.getClosedDate();
        this.days = testrun.getDays();
        this.excludeHoliday = testrun.getExcludeHoliday();
        this.startTime = testrun.getStartTime();
        this.durationHours = testrun.getDurationHours();
        this.reserveExpired = testrun.getReserveExpired();
        this.reserveResultId = testrun.getReserveResultId();
        this.deadlineClose = testrun.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrun.getAutoTestcaseNotAssignedTester();
    }

    public TestrunListResponse(TestrunListDTO testrun) {
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
        this.closedDate = testrun.getClosedDate();
        this.days = testrun.getDays();
        this.excludeHoliday = testrun.getExcludeHoliday();
        this.startTime = testrun.getStartTime();
        this.durationHours = testrun.getDurationHours();
        this.reserveExpired = testrun.getReserveExpired();
        this.reserveResultId = testrun.getReserveResultId();
        this.deadlineClose = testrun.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrun.getAutoTestcaseNotAssignedTester();
    }


}
