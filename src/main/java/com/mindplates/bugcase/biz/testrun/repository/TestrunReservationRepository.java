package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TestrunReservationRepository extends JpaRepository<TestrunReservation, Long> {

    List<TestrunReservation> findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByStartDateTimeDescIdDesc(String spaceCode, Long projectId, Boolean expired);

    List<TestrunReservation> findAllByExpiredFalse();

    @Modifying
    @Query("UPDATE TestrunReservation trr SET trr.expired = :expired, trr.testrun.id = :referenceTestrunId WHERE trr.id = :testrunReservationId")
    void updateTestrunReservationExpired(@Param("testrunReservationId") Long testrunReservationId, @Param("expired") Boolean expired, @Param("referenceTestrunId") Long referenceTestrunId);


}

