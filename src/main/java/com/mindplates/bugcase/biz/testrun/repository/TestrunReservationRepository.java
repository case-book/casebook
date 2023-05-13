package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TestrunReservationRepository extends JpaRepository<TestrunReservation, Long> {

    List<TestrunReservation> findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByStartDateTimeDescIdDesc(String spaceCode, Long projectId, Boolean expired);

    List<TestrunReservation> findAllByExpiredFalse();

    Optional<TestrunReservation> findByTestrunId(Long testrunId);

    @Modifying
    @Query("UPDATE TestrunReservation trr SET trr.expired = :expired, trr.testrun.id = :referenceTestrunId WHERE trr.id = :testrunReservationId")
    void updateTestrunReservationExpired(@Param("testrunReservationId") Long testrunReservationId, @Param("expired") Boolean expired, @Param("referenceTestrunId") Long referenceTestrunId);

    @Modifying
    @Query("UPDATE TestrunReservation trr SET trr.testrun.id = null WHERE trr.testrun.id = :testrunId")
    void updateTestrunReservationTestrunId(@Param("testrunId") Long testrunId);


}

