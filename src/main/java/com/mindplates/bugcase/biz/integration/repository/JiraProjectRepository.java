package com.mindplates.bugcase.biz.integration.repository;

import com.mindplates.bugcase.biz.integration.entity.JiraProject;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JiraProjectRepository extends JpaRepository<JiraProject, Long> {

    Optional<JiraProject> findByProjectId(long id);
}
