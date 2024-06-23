package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
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
public class SpaceLlmPromptResponse {

    private Long id;
    private String systemRole;
    private String prompt;
    private String name;
    private boolean activated;
    private Long spaceId;


    public SpaceLlmPromptResponse(SpaceLlmPromptDTO spaceLlmPromptDTO) {
        this.id = spaceLlmPromptDTO.getId();
        this.name = spaceLlmPromptDTO.getName();
        this.systemRole = spaceLlmPromptDTO.getSystemRole();
        this.prompt = spaceLlmPromptDTO.getPrompt();
        this.activated = spaceLlmPromptDTO.isActivated();
        if (spaceLlmPromptDTO.getSpace() != null) {
            this.spaceId = spaceLlmPromptDTO.getSpace().getId();
        }

    }
}
