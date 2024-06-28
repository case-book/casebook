package com.mindplates.bugcase.biz.ai.dto;


import com.mindplates.bugcase.biz.ai.entity.Llm;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LlmDTO extends CommonDTO implements IDTO<Llm> {

    private Long id;
    private LlmTypeCode llmTypeCode;
    private OpenAiDTO openAi;
    private SpaceDTO space;
    private boolean activated;

    public LlmDTO(Llm llm) {
        this.id = llm.getId();
        this.llmTypeCode = llm.getLlmTypeCode();
        this.openAi = new OpenAiDTO(llm.getOpenAi());
        this.activated = llm.isActivated();
        if (llm.getSpace() != null) {
            this.space = SpaceDTO.builder().id(llm.getSpace().getId()).build();
        }
    }

    @Override
    public Llm toEntity() {
        Llm llm = Llm.builder()
            .id(id)
            .llmTypeCode(llmTypeCode)
            .space(Space.builder().id(space.getId()).build())
            .activated(activated)
            .build();

        if (openAi != null) {
            llm.setOpenAi(openAi.toEntity(llm));
        }

        return llm;
    }

    public Llm toEntity(Space space) {
        Llm llm = toEntity();
        llm.setSpace(space);
        return llm;
    }
}
