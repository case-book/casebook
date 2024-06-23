package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceLlmPrompt;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SpaceLlmPromptDTO extends CommonDTO {

    private Long id;
    private String name;
    private String systemRole;
    private String prompt;
    private boolean activated;
    private SpaceDTO space;


    public SpaceLlmPromptDTO(SpaceLlmPrompt spaceLlmPrompt) {
        this.id = spaceLlmPrompt.getId();
        this.name = spaceLlmPrompt.getName();
        this.systemRole = spaceLlmPrompt.getSystemRole();
        this.prompt = spaceLlmPrompt.getPrompt();
        this.activated = spaceLlmPrompt.isActivated();
        this.space = SpaceDTO.builder().id(spaceLlmPrompt.getSpace().getId()).build();
    }


}
