package com.mindplates.bugcase.biz.ai.vo.response;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.code.LlmTypeCode;
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
public class LlmResponse {

    private Long id;
    private LlmTypeCode llmTypeCode;
    private OpenAiResponse openAi;
    private SpaceDTO space;
    private boolean activated;


    public LlmResponse(LlmDTO llm) {
        this.id = llm.getId();
        this.llmTypeCode = llm.getLlmTypeCode();
        this.openAi = new OpenAiResponse(llm.getOpenAi());
        this.activated = llm.isActivated();
        if (llm.getSpace() != null) {
            this.space = SpaceDTO.builder().id(llm.getSpace().getId()).build();
        }
    }
}
