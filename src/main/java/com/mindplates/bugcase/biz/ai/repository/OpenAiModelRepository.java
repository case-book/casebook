package com.mindplates.bugcase.biz.ai.repository;

import com.mindplates.bugcase.biz.ai.entity.OpenAiModel;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpenAiModelRepository extends JpaRepository<OpenAiModel, Long> {

    Optional<OpenAiModel> findByIdAndOpenAiLlmSpaceCode(long modelId, String spaceCode);

}

