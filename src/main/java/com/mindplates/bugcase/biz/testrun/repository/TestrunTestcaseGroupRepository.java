package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunTestcaseGroupRepository extends JpaRepository<TestrunTestcaseGroup, Long> {

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testrunReservation.id = :testrunReservationId")
    void deleteByTestrunReservationId(@Param("testrunReservationId") Long testrunReservationId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testrunIteration.id = :testrunIterationId")
    void deleteByTestrunIterationId(@Param("testrunIterationId") Long testrunIterationId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testcaseGroup.id = :testcaseGroupId")
    void deleteByTestcaseGroupId(@Param("testcaseGroupId") Long testcaseGroupId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testcaseGroup.id IN (:ids)")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testcaseGroup.id IN (SELECT tg.id FROM TestcaseGroup tg WHERE tg.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);

}

