package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {

    Optional<ProjectFile> findByProjectIdAndId(Long projectId, Long imageId);

    Optional<ProjectFile> findByIdAndProjectIdAndUuid(Long imageId, Long projectId, String uuid);

    @Modifying
    @Query("DELETE FROM ProjectFile pf WHERE pf.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

    List<ProjectFile> findAllByProjectId(Long projectId);
}

