package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {

    Optional<ProjectFile> findByIdAndProjectIdAndUuid(Long imageId, Long projectId, String uuid);

    @Modifying
    @Query("DELETE FROM ProjectFile pf WHERE pf.project.id = :projectId AND pf.fileSourceType = :fileSourceType AND pf.fileSourceId IN (:ids)")
    void deleteByProjectFileSourceIds(@Param("projectId") Long projectId, @Param("fileSourceType") FileSourceTypeCode fileSourceType,
        @Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM ProjectFile pf WHERE pf.project.id = :projectId AND pf.fileSourceType = :fileSourceType AND pf.fileSourceId = :id")
    void deleteByProjectFileSourceId(@Param("projectId") Long projectId, @Param("fileSourceType") FileSourceTypeCode fileSourceType,
        @Param("id") Long id);

    List<ProjectFile> findAllByProjectId(Long projectId);

    List<ProjectFile> findAllByProjectIdAndFileSourceTypeAndFileSourceIdIn(Long projectId, FileSourceTypeCode fileSourceTypeCode, List<Long> ids);

    List<ProjectFile> findAllByProjectIdAndFileSourceTypeAndFileSourceId(Long projectId, FileSourceTypeCode fileSourceTypeCode, Long fileSourceId);
}

