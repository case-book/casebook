package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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


    public TestrunListResponse(Testrun testrun) {
        this.id = testrun.getId();
        this.name = testrun.getName();
        this.description = testrun.getDescription();
        this.startDateTime = testrun.getStartDateTime();
        this.endDateTime = testrun.getEndDateTime();
        this.opened = testrun.isOpened();
        this.totalTestcaseCount = testrun.getTotalTestcaseCount();
        this.passedTestcaseCount = testrun.getPassedTestcaseCount();
        this.failedTestcaseCount = testrun.getFailedTestcaseCount();
    }


}
