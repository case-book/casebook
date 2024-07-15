package com.mindplates.bugcase.biz.ai.service;

import com.mindplates.bugcase.biz.ai.dto.AiRequestHistoryDTO;
import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.ai.entity.AiRequestHistory;
import com.mindplates.bugcase.biz.ai.entity.Llm;
import com.mindplates.bugcase.biz.ai.entity.OpenAi;
import com.mindplates.bugcase.biz.ai.entity.OpenAiModel;
import com.mindplates.bugcase.biz.ai.repository.AiRequestHistoryRepository;
import com.mindplates.bugcase.biz.ai.repository.LlmRepository;
import com.mindplates.bugcase.biz.ai.repository.OpenAiModelRepository;
import com.mindplates.bugcase.biz.ai.repository.OpenAiRepository;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class LlmService {

    private final LlmRepository llmRepository;
    private final OpenAiModelRepository openAiModelRepository;
    private final OpenAiRepository openAiRepository;
    private final AiRequestHistoryRepository aiRequestHistoryRepository;
    private final MappingUtil mappingUtil;

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

    public OpenAiModelDTO selectOpenAiModel(long modelId, String spaceCode) {
        OpenAiModel model = openAiModelRepository.findByIdAndOpenAiLlmSpaceCode(modelId, spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new OpenAiModelDTO(model);
    }

    public OpenAiDTO selectOpenAiInfo(long modelId, String spaceCode) {
        OpenAi model = openAiRepository.findByModelsIdAndLlmSpaceCode(modelId, spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new OpenAiDTO(model);
    }

    public AiRequestHistoryDTO createAiRequestHistoryInfo(AiRequestHistoryDTO aiRequestHistory) {
        AiRequestHistory result = aiRequestHistoryRepository.save(mappingUtil.convert(aiRequestHistory, AiRequestHistory.class));
        return new AiRequestHistoryDTO(result);
    }


}
