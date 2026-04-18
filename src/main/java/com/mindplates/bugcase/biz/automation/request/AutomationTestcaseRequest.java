package com.mindplates.bugcase.biz.automation.request;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutomationTestcaseRequest {

    private Long testcaseGroupSeqNumber;

    @NotBlank
    private String name;

    private String description;

    private String testerType;

    private String testerValue;

    private Boolean closed;

    @Valid
    private List<AutomationTestcaseItemRequest> testcaseItems;
}
