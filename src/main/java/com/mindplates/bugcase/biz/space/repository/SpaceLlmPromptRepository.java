package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceLlmPrompt;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceLlmPromptRepository extends JpaRepository<SpaceLlmPrompt, Long> {

    List<SpaceLlmPrompt> findByActivatedTrue();

    Optional<SpaceLlmPrompt> findBySpaceCodeAndActivatedTrue(String spaceCode);


}

