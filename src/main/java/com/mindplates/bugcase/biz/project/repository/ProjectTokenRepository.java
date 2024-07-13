package com.mindplates.bugcase.biz.project.repository;


import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectTokenRepository extends JpaRepository<ProjectToken, Long> {

    Optional<ProjectToken> findByToken(String token);

    List<ProjectToken> findAllByProjectId(Long projectId);

    boolean existsByToken(String token);

    @Modifying
    @Query("DELETE FROM ProjectToken pt WHERE pt.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

}

