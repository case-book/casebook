package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import java.util.List;
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

    @Modifying
    void deleteByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM TestrunUser tu WHERE tu.testrun.id IN (SELECT tr.id FROM Testrun tr WHERE tr.project.id = :projectId) OR tu.testrunReservation.id IN (SELECT tr.id FROM TestrunReservation tr WHERE tr.project.id = :projectId) OR tu.testrunIteration.id IN (SELECT tr.id FROM TestrunIteration tr WHERE tr.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("DELETE FROM TestrunUser tu WHERE tu.user.id = :userId AND (tu.testrun.id IN (SELECT tr.id FROM Testrun tr WHERE tr.project.id = :projectId) OR tu.testrunReservation.id IN (SELECT tr.id FROM TestrunReservation tr WHERE tr.project.id = :projectId) OR tu.testrunIteration.id IN (SELECT tr.id FROM TestrunIteration tr WHERE tr.project.id = :projectId))")
    void deleteByProjectIdAndUserId(@Param("projectId") Long projectId, @Param("userId") Long userId);

    List<TestrunUser> findByTestrunId(Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunUser tu WHERE tu.testrun.id = :testrunId AND tu.user.id = :userId")
    void deleteByTestrunIdAndUserId(@Param("testrunId") Long projectId, @Param("userId") Long userId);
}

