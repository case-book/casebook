package com.mindplates.bugcase.biz.config.repository;

import com.mindplates.bugcase.biz.config.entity.LlmPrompt;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LlmPromptRepository extends JpaRepository<LlmPrompt, Long> {

    List<LlmPrompt> findByActivatedTrue();


}

