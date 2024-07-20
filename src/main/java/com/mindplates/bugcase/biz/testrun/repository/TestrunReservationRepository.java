package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunReservationRepository extends JpaRepository<TestrunReservation, Long> {

    String TESTRUN_RESERVATION_LIST_PROJECTION = "SELECT new TestrunReservation(tr.id, tr.name, tr.description, tr.project.id, tr.startDateTime, tr.endDateTime, tr.expired, tr.deadlineClose, tr.autoTestcaseNotAssignedTester, tr.testcaseGroupCount, tr.testcaseCount, tr.testrun.id, tr.selectCreatedTestcase, tr.selectUpdatedTestcase) FROM TestrunReservation tr ";

    @Query(value = TESTRUN_RESERVATION_LIST_PROJECTION + " WHERE tr.project.id = :projectId AND tr.expired = :expired ORDER BY tr.startDateTime DESC, tr.id DESC")
    List<TestrunReservation> findAllByProjectIdAndExpiredOrderByStartDateTimeDescIdDesc(Long projectId, Boolean expired);

    @Query(value = TESTRUN_RESERVATION_LIST_PROJECTION + " WHERE tr.expired = false")
    List<TestrunReservation> findAllByExpiredFalse();

    @Modifying
    @Query("UPDATE TestrunReservation tr SET tr.expired = :expired, tr.testrun.id = :referenceTestrunId WHERE tr.id = :testrunReservationId")
    void updateTestrunReservationExpired(@Param("testrunReservationId") Long testrunReservationId, @Param("expired") Boolean expired,
        @Param("referenceTestrunId") Long referenceTestrunId);

    @Modifying
    @Query("UPDATE TestrunReservation tr SET tr.testrun.id = null WHERE tr.testrun.id = :testrunId")
    void updateTestrunReservationTestrunId(@Param("testrunId") Long testrunId);


    @Modifying
    @Query("DELETE FROM TestrunReservation tr WHERE tr.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
}

