package com.mindplates.bugcase.biz.config.vo.request;

import com.mindplates.bugcase.biz.config.dto.LlmPromptDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class LlmPromptRequest implements IRequestVO<LlmPromptDTO> {

    private Long id;
    private String systemRole;
    private String name;
    private String prompt;
    private boolean activated;

    @Override
    public LlmPromptDTO toDTO() {
        return LlmPromptDTO
            .builder()
            .id(id)
            .name(name)
            .systemRole(systemRole)
            .prompt(prompt)
            .activated(activated)
            .build();
    }


}
