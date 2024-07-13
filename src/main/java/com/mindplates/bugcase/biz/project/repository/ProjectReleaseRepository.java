package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectReleaseRepository extends JpaRepository<ProjectRelease, Long> {

    List<ProjectRelease> findByProjectIdOrderByNameDesc(long projectId);

    Long countByProjectIdAndName(long projectId, String name);

    Long countByProjectIdAndNameAndIdIsNot(long projectId, String name, long id);

    List<ProjectRelease> findByProjectIdAndIsTargetTrue(long projectId);

    Optional<ProjectRelease> findByIdAndProjectId(long projectReleaseId, long projectId);


    @Modifying
    @Query("DELETE FROM ProjectRelease pr WHERE pr.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
}
