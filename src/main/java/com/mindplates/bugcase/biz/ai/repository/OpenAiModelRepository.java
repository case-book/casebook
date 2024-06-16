package com.mindplates.bugcase.biz.ai.repository;

import com.mindplates.bugcase.biz.ai.entity.OpenAiModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpenAiModelRepository extends JpaRepository<OpenAiModel, Long> {

}

