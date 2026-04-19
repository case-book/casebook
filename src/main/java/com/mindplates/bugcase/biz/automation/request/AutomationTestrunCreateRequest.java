package com.mindplates.bugcase.biz.automation.request;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutomationTestrunCreateRequest {

    @NotBlank
    private String name;

    private String description;

    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    private Boolean opened;

    private Boolean autoTestcaseNotAssignedTester;

    private Boolean addConnectedSequenceTestcase;

    private Boolean assignSequenceTestcaseSameTester;

    private List<Long> testrunUserIds;

    private List<Long> testcaseSeqNumbers;

    private List<Long> testcaseGroupSeqNumbers;
}
