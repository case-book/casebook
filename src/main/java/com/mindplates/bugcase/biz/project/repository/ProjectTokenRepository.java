package com.mindplates.bugcase.biz.project.repository;


import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectTokenRepository extends JpaRepository<ProjectToken, Long> {

    Optional<ProjectToken> findByToken(String token);

    List<ProjectToken> findAllByProjectId(Long projectId);

    Long countByToken(String token);

}

