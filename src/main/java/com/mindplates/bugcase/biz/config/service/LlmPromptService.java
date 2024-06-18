package com.mindplates.bugcase.biz.config.service;

import com.mindplates.bugcase.biz.config.dto.LlmPromptDTO;
import com.mindplates.bugcase.biz.config.entity.LlmPrompt;
import com.mindplates.bugcase.biz.config.repository.LlmPromptRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class LlmPromptService {

    private final LlmPromptRepository llmPromptRepository;
    private final MappingUtil mappingUtil;

    @Transactional
    public LlmPromptDTO createLlmPrompt(LlmPromptDTO llmPrompt) {
        LlmPrompt result = llmPromptRepository.save(mappingUtil.convert(llmPrompt, LlmPrompt.class));
        return new LlmPromptDTO(result);
    }

    @Transactional
    public void saveLlmPromptList(List<LlmPromptDTO> llmPrompts) {
        long activatedCount = llmPrompts.stream().filter(LlmPromptDTO::isActivated).count();
        if (activatedCount > 1) {
            throw new ServiceException("error.llm.prompt.activated.many");
        }

        List<LlmPrompt> all = llmPromptRepository.findAll();
        List<LlmPrompt> list = llmPrompts.stream().map(llmPrompt -> mappingUtil.convert(llmPrompt, LlmPrompt.class)).collect(Collectors.toList());
        all.stream().filter(llmPrompt -> list.stream().noneMatch(item -> item.getId().equals(llmPrompt.getId()))).forEach(llmPromptRepository::delete);
        llmPromptRepository.saveAll(list);
    }

    public List<LlmPromptDTO> selectLlmPromptList() {
        List<LlmPrompt> list = llmPromptRepository.findAll();
        return list.stream().map(LlmPromptDTO::new).collect(Collectors.toList());
    }

    public LlmPromptDTO selectActivatedLlmPromptInfo() {
        List<LlmPrompt> list = llmPromptRepository.findByActivatedTrue();
        if (!list.isEmpty()) {
            return new LlmPromptDTO(list.get(0));
        }
        return null;
    }

}
