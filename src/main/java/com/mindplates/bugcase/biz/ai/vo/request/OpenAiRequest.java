package com.mindplates.bugcase.biz.ai.vo.request;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.vo.IRequestVO;
import java.util.List;
import lombok.Data;

@Data
public class OpenAiRequest implements IRequestVO<OpenAiDTO> {

    private Long id;
    private LlmTypeCode llmTypeCode;
    private String name;
    private String url;
    private String apiKey;
    private List<OpenAiModelRequest> models;
    private LlmRequest llm;

    @Override
    public OpenAiDTO toDTO() {
        OpenAiDTO dto = OpenAiDTO
            .builder()
            .id(id)
            .name(name)
            .url(url)
            .apiKey(apiKey)
            .build();

        if (models != null) {
            dto.setModels(models.stream().map(model -> model.toDTO(dto)).collect(java.util.stream.Collectors.toList()));
        }

        return dto;
    }

    public OpenAiDTO toDTO(LlmDTO llm) {
        OpenAiDTO dto = toDTO();
        dto.setLlm(llm);
        return dto;
    }


}
