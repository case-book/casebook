package com.mindplates.bugcase.biz.ai.dto;


import com.mindplates.bugcase.biz.ai.entity.OpenAi;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAiDTO extends CommonDTO {

    private Long id;
    private String name; // openai
    private String url; // https://api.openai.com/v1
    private String apiKey; // sk-kdkdkdk
    private List<OpenAiModelDTO> models;
    private LlmDTO llm;

    public OpenAiDTO(OpenAi openAi) {
        this.id = openAi.getId();
        this.name = openAi.getName();
        this.url = openAi.getUrl();
        this.apiKey = openAi.getApiKey();
        if (openAi.getLlm() != null) {
            this.llm = LlmDTO.builder().id(openAi.getLlm().getId()).build();
        }
        this.models = openAi.getModels().stream().map(OpenAiModelDTO::new).collect(java.util.stream.Collectors.toList());
    }

}
