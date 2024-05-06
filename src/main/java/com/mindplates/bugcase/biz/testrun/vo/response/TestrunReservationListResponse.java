package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunReservationDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunReservationListResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private boolean expired;
    private boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private int testcaseGroupCount;
    private int testcaseCount;

    private Long testrunId;

    public TestrunReservationListResponse(TestrunReservationDTO testrunReservation) {
        this.id = testrunReservation.getId();
        this.name = testrunReservation.getName();
        this.description = testrunReservation.getDescription();
        this.startDateTime = testrunReservation.getStartDateTime();
        this.endDateTime = testrunReservation.getEndDateTime();
        this.expired = testrunReservation.getExpired();
        this.deadlineClose = testrunReservation.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrunReservation.getAutoTestcaseNotAssignedTester();
        this.testcaseGroupCount = testrunReservation.getTestcaseGroupCount();
        this.testcaseCount = testrunReservation.getTestcaseCount();
        if (testrunReservation.getTestrun() != null) {
            this.testrunId = testrunReservation.getTestrun().getId();
        }

    }

}
