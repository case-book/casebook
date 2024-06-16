package com.mindplates.bugcase.biz.ai.service;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.entity.Llm;
import com.mindplates.bugcase.biz.ai.entity.OpenAi;
import com.mindplates.bugcase.biz.ai.repository.AiRequestHistoryRepository;
import com.mindplates.bugcase.biz.ai.repository.LlmRepository;
import com.mindplates.bugcase.biz.ai.repository.OpenAiModelRepository;
import com.mindplates.bugcase.biz.ai.repository.OpenAiRepository;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class AiService {

    private final LlmRepository llmRepository;
    private final OpenAiModelRepository openAiModelRepository;
    private final OpenAiRepository openAiRepository;
    private final AiRequestHistoryRepository aiRequestHistoryRepository;

    @Transactional
    public LlmDTO createLlm(String name, String url, String apiKey, Long spaceId) {

        Llm llm = Llm.builder()
            .llmTypeCode(LlmTypeCode.OPENAI)
            .space(Space.builder().id(spaceId).build())
            .build();

        OpenAi openAi = OpenAi.builder()
            .name(name)
            .url(url)
            .apiKey(apiKey)
            .build();

        llm.setOpenAi(openAi);

        Llm result = llmRepository.save(llm);
        return new LlmDTO(result);
    }


}
