package com.mindplates.bugcase.biz.ai.dto;


import com.mindplates.bugcase.biz.ai.entity.Llm;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LlmDTO extends CommonDTO {

    private Long id;
    private LlmTypeCode llmTypeCode;
    private OpenAiDTO openAi;
    private SpaceDTO space;

    public LlmDTO(Llm llm) {
        this.id = llm.getId();
        this.llmTypeCode = llm.getLlmTypeCode();
        this.openAi = new OpenAiDTO(llm.getOpenAi());
        if (llm.getSpace() != null) {
            this.space = SpaceDTO.builder().id(llm.getSpace().getId()).build();
        }
    }

}
