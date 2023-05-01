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

}

