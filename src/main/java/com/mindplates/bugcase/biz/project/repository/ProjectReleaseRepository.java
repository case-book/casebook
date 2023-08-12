package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectReleaseRepository extends JpaRepository<ProjectRelease, Long> {

    List<ProjectRelease> findByProjectId(long projectId);
}
