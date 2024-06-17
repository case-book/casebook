package com.mindplates.bugcase.biz.config.vo.response;

import com.mindplates.bugcase.biz.config.dto.LlmPromptDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LlmPromptResponse {

    private Long id;
    private String systemRole;
    private String prompt;
    private String name;
    private boolean activated;


    public LlmPromptResponse(LlmPromptDTO llmPrompt) {
        this.id = llmPrompt.getId();
        this.name = llmPrompt.getName();
        this.systemRole = llmPrompt.getSystemRole();
        this.prompt = llmPrompt.getPrompt();
        this.activated = llmPrompt.isActivated();

    }
}
