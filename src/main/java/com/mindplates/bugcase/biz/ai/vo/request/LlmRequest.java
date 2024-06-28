package com.mindplates.bugcase.biz.ai.vo.request;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class LlmRequest implements IRequestVO<LlmDTO> {

    private Long id;
    private LlmTypeCode llmTypeCode;
    private OpenAiRequest openAi;
    private boolean activated;

    @Override
    public LlmDTO toDTO() {
        LlmDTO llm = LlmDTO
            .builder()
            .id(id)
            .llmTypeCode(llmTypeCode)
            .activated(activated)
            .build();

        OpenAiDTO openAiDto = openAi.toDTO();
        openAiDto.setLlm(llm);
        llm.setOpenAi(openAiDto);

        return llm;

    }

    public LlmDTO toDTO(SpaceDTO space) {
        LlmDTO dto = toDTO();
        dto.setSpace(space);
        return dto;

    }


}
