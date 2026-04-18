package com.mindplates.bugcase.biz.automation.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AutomationTestcaseItemRequest {

    @NotNull
    private Long testcaseTemplateItemId;

    private String type;

    private String value;

    private String text;
}
