package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceLlmPrompt;
import com.mindplates.bugcase.biz.space.repository.SpaceLlmPromptRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class SpaceLlmPromptService {

    private final SpaceLlmPromptRepository spaceLlmPromptRepository;

    @Transactional
    public SpaceLlmPromptDTO createSpaceLlmPrompt(SpaceLlmPromptDTO llmPrompt) {
        SpaceLlmPrompt result = spaceLlmPromptRepository.save(llmPrompt.toEntity());
        return new SpaceLlmPromptDTO(result);
    }

    @Transactional
    public void saveLlmPromptList(List<SpaceLlmPromptDTO> llmPrompts) {
        long activatedCount = llmPrompts.stream().filter(SpaceLlmPromptDTO::isActivated).count();
        if (activatedCount > 1) {
            throw new ServiceException("error.llm.prompt.activated.many");
        }

        List<SpaceLlmPrompt> all = spaceLlmPromptRepository.findAll();
        List<SpaceLlmPrompt> list = llmPrompts.stream().map(SpaceLlmPromptDTO::toEntity).collect(Collectors.toList());
        all.stream().filter(llmPrompt -> list.stream().noneMatch(item -> item.getId().equals(llmPrompt.getId()))).forEach(spaceLlmPromptRepository::delete);
        spaceLlmPromptRepository.saveAll(list);
    }

    public List<SpaceLlmPromptDTO> selectLlmPromptList() {
        List<SpaceLlmPrompt> list = spaceLlmPromptRepository.findAll();
        return list.stream().map(SpaceLlmPromptDTO::new).collect(Collectors.toList());
    }

    public SpaceLlmPromptDTO selectActivatedLlmPromptInfo() {
        List<SpaceLlmPrompt> list = spaceLlmPromptRepository.findByActivatedTrue();
        if (!list.isEmpty()) {
            return new SpaceLlmPromptDTO(list.get(0));
        }
        return null;
    }

    public SpaceLlmPromptDTO selectActivatedLlmPromptInfo(String spaceCode) {
        SpaceLlmPrompt spaceLlmPrompt = spaceLlmPromptRepository.findBySpaceCodeAndActivatedTrue(spaceCode)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "error.project.llm.prompt.not.activated"));
        return spaceLlmPrompt == null ? null : new SpaceLlmPromptDTO(spaceLlmPrompt);
    }

}
