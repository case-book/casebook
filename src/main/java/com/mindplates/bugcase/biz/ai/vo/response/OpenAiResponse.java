package com.mindplates.bugcase.biz.ai.vo.response;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import java.util.List;
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
public class OpenAiResponse {

    private Long id;
    private String name; // openai
    private String url; // https://api.openai.com/v1
    private String apiKey; // sk-kdkdkdk
    private List<OpenAiModelResponse> models;
    private LlmDTO llm;


    public OpenAiResponse(OpenAiDTO openAi) {
        this.id = openAi.getId();
        this.name = openAi.getName();
        this.url = openAi.getUrl();
        this.apiKey = openAi.getApiKey();
        if (openAi.getLlm() != null) {
            this.llm = LlmDTO.builder().id(openAi.getLlm().getId()).build();
        }

        if (openAi.getModels() != null) {
            this.models = openAi.getModels().stream().map(OpenAiModelResponse::new).collect(java.util.stream.Collectors.toList());
        }
    }

    public OpenAiResponse(OpenAiDTO openAi, boolean masking) {
        this(openAi);
        this.apiKey = "********";
    }
}
