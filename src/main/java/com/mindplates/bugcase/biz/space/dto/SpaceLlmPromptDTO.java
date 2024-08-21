package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceLlmPrompt;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class SpaceLlmPromptDTO extends CommonDTO implements IDTO<SpaceLlmPrompt> {

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


    @Override
    public SpaceLlmPrompt toEntity() {
        return SpaceLlmPrompt.builder()
            .id(id)
            .name(name)
            .systemRole(systemRole)
            .prompt(prompt)
            .activated(activated)
            .space(Space.builder().id(space.getId()).build())
            .build();
    }

    public SpaceLlmPrompt toEntity(Space space) {
        SpaceLlmPrompt spaceLlmPrompt = toEntity();
        spaceLlmPrompt.setSpace(space);
        return spaceLlmPrompt;

    }
}
