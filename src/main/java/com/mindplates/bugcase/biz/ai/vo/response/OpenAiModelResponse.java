package com.mindplates.bugcase.biz.ai.vo.response;

import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
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
public class OpenAiModelResponse {

    Long id;
    private String name;
    private String code;
    private OpenAiResponse openAi;


    public OpenAiModelResponse(OpenAiModelDTO OpenAiModel) {
        this.id = OpenAiModel.getId();
        this.name = OpenAiModel.getName();
        this.code = OpenAiModel.getCode();
        this.openAi = OpenAiResponse.builder().id(OpenAiModel.getOpenAi().getId()).build();
    }
}
