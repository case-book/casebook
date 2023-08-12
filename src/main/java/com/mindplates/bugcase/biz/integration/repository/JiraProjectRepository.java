package com.mindplates.bugcase.biz.integration.repository;

import com.mindplates.bugcase.biz.integration.entity.JiraProject;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface JiraProjectRepository extends JpaRepository<JiraProject, Long> {

    Optional<JiraProject> findByProjectId(long id);

    @Modifying
    @Query("DELETE FROM JiraProject j WHERE j.project.space.id = :spaceId")
    void deleteBySpaceId(long spaceId);

    @Modifying
    @Query("DELETE FROM JiraProject j WHERE j.project.id = :projectId")
    void deleteByProjectId(long projectId);
}
