package com.mindplates.bugcase.biz.project.repository;


import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProjectTokenRepository extends JpaRepository<ProjectToken, Long> {

    Optional<ProjectToken> findByToken(String token);

    List<ProjectToken> findAllByProjectId(Long projectId);

    Long countByToken(String token);

    @Modifying
    @Query("UPDATE ProjectToken pt SET pt.lastAccess = :lastAccess WHERE pt.id = :projectTokenId")
    void updateProjectTokenLastAccess(Long projectTokenId, LocalDateTime lastAccess);
}

