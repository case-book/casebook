package com.mindplates.bugcase.biz.ai.dto;


import com.mindplates.bugcase.biz.ai.entity.OpenAiModel;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAiModelDTO extends CommonDTO {

    Long id;
    private String name; // gpt-3.5-turbo
    private String code; // gpt-3.5-turbo
    private OpenAiDTO openAi;

    public OpenAiModelDTO(OpenAiModel openAiModel) {
        this.id = openAiModel.getId();
        this.name = openAiModel.getName();
        this.code = openAiModel.getCode();
        if (openAiModel.getOpenAi() != null) {
            this.openAi = OpenAiDTO.builder().id(openAiModel.getOpenAi().getId()).build();
        }
    }

}
