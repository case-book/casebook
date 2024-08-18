package com.mindplates.bugcase.biz.ai.vo.request;

import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class OpenAiModelRequest implements IRequestVO<OpenAiModelDTO> {

    private Long id;
    private String name;
    private String code;


    @Override
    public OpenAiModelDTO toDTO() {
        return OpenAiModelDTO
            .builder()
            .id(id)
            .name(name)
            .code(code)
            .build();
    }

    public OpenAiModelDTO toDTO(OpenAiDTO openAi) {
        OpenAiModelDTO dto = toDTO();
        dto.setOpenAi(openAi);
        return dto;
    }


}
