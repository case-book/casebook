package com.mindplates.bugcase.biz.config.dto;

import com.mindplates.bugcase.biz.config.entity.LlmPrompt;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LlmPromptDTO extends CommonDTO {

    private Long id;
    private String name;
    private String systemRole;
    private String prompt;
    private boolean activated;


    public LlmPromptDTO(LlmPrompt llmPrompt) {
        this.id = llmPrompt.getId();
        this.name = llmPrompt.getName();
        this.systemRole = llmPrompt.getSystemRole();
        this.prompt = llmPrompt.getPrompt();
        this.activated = llmPrompt.isActivated();
    }


}
