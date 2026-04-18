package com.mindplates.bugcase.biz.automation.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutomationTestcaseGroupRequest {

    private Long parentSeqNumber;

    @NotBlank
    private String name;

    private String description;
}
