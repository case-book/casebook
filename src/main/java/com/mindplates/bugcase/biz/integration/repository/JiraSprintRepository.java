package com.mindplates.bugcase.biz.integration.repository;

import com.mindplates.bugcase.biz.integration.entity.JiraSprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface JiraSprintRepository extends JpaRepository<JiraSprint, Long> {

    @Modifying
    @Query("DELETE FROM JiraSprint js WHERE js.testrun.project.space.id = :spaceId")
    void deleteBySpaceId(long spaceId);

    @Modifying
    @Query("DELETE FROM JiraSprint js WHERE js.testrun.project.id = :projectId")
    void deleteByProjectId(long projectId);

    @Modifying
    @Query("DELETE FROM JiraSprint js WHERE js.testrun.id = :testrunId")
    void deleteByTestrunId(long testrunId);

}
