package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TestrunIterationRepository extends JpaRepository<TestrunIteration, Long> {

    List<TestrunIteration> findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByReserveStartDateTimeDescIdDesc(String spaceCode, Long projectId, Boolean expired);

    List<TestrunIteration> findAllByExpiredFalse();

    @Modifying
    @Query("UPDATE TestrunIteration tri SET tri.expired = :expired WHERE tri.id = :testrunIterationId")
    void updateTestrunIterationExpired(@Param("testrunIterationId") Long testrunIterationId, @Param("expired") Boolean expired);

    @Modifying
    @Query("UPDATE TestrunIteration tri SET tri.filteringUserCursor = :filteringUserCursor, tri.currentFilteringUserIds = :currentFilteringUserIds WHERE tri.id = :testrunIterationId")
    void updateTestrunIterationUserCursor(@Param("testrunIterationId") Long testrunIterationId, @Param("filteringUserCursor") Integer filteringUserCursor, @Param("currentFilteringUserIds") List<Long> currentFilteringUserIds );

    @Modifying
    @Query("DELETE FROM TestrunIteration ti WHERE ti.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

}

