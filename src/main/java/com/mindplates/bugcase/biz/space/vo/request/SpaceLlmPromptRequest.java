package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class SpaceLlmPromptRequest implements IRequestVO<SpaceLlmPromptDTO> {

    private Long id;
    private String systemRole;
    private String name;
    private String prompt;
    private boolean activated;

    @Override
    public SpaceLlmPromptDTO toDTO() {
        return SpaceLlmPromptDTO
            .builder()
            .id(id)
            .name(name)
            .systemRole(systemRole)
            .prompt(prompt)
            .activated(activated)
            .build();
    }

    public SpaceLlmPromptDTO toDTO(SpaceDTO space) {
        SpaceLlmPromptDTO dto = toDTO();
        dto.setSpace(space);
        return dto;

    }


}
