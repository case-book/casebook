package com.mindplates.bugcase.biz.ai.dto;


import com.mindplates.bugcase.biz.ai.entity.Llm;
import com.mindplates.bugcase.biz.ai.entity.OpenAi;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class OpenAiDTO extends CommonDTO implements IDTO<OpenAi> {

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
        if (openAi.getModels() != null) {
            this.models = openAi.getModels().stream().map(OpenAiModelDTO::new).collect(java.util.stream.Collectors.toList());
        }

    }

    @Override
    public OpenAi toEntity() {
        OpenAi openAi = OpenAi.builder()
            .id(id)
            .name(name)
            .url(url)
            .apiKey(apiKey)
            .llm(Llm.builder().id(llm.getId()).build())
            .build();

        if (models != null) {
            openAi.setModels(models.stream().map(openAiModelDTO -> openAiModelDTO.toEntity(openAi)).collect(java.util.stream.Collectors.toList()));

        }

        return openAi;
    }

    public OpenAi toEntity(Llm llm) {
        OpenAi openAi = toEntity();
        openAi.setLlm(llm);
        return openAi;
    }
}
