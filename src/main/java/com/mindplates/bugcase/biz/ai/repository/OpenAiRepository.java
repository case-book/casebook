package com.mindplates.bugcase.biz.ai.repository;

import com.mindplates.bugcase.biz.ai.entity.OpenAi;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpenAiRepository extends JpaRepository<OpenAi, Long> {

    Optional<OpenAi> findByModelsIdAndLlmSpaceCode(long modelId, String spaceCode);

}

