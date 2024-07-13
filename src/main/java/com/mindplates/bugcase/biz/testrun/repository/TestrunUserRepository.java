package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunUserRepository extends JpaRepository<TestrunUser, Long> {

    @Modifying
    @Query("DELETE FROM TestrunUser tu WHERE tu.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunUser tu WHERE tu.testrunReservation.id = :testrunReservationId")
    void deleteByTestrunReservationId(@Param("testrunReservationId") Long testrunReservationId);

    @Modifying
    @Query("DELETE FROM TestrunUser tu WHERE tu.testrunIteration.id = :testrunIterationId")
    void deleteByTestrunIterationId(@Param("testrunIterationId") Long testrunIterationId);

    void deleteByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM TestrunUser tu WHERE tu.testrun.id IN (SELECT tr.id FROM Testrun tr WHERE tr.project.id = :projectId) OR tu.testrunReservation.id IN (SELECT tr.id FROM TestrunReservation tr WHERE tr.project.id = :projectId) OR tu.testrunIteration.id IN (SELECT tr.id FROM TestrunIteration tr WHERE tr.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);
}

