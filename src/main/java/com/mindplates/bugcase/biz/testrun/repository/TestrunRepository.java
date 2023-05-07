package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TestrunRepository extends JpaRepository<Testrun, Long> {

    Optional<Testrun> findAllByProjectIdAndSeqId(Long projectId, String seqId);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdOrderByEndDateTimeDescIdDesc(String spaceCode, Long projectId);


    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(String spaceCode, Long projectId, boolean opened);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(String spaceCode, Long projectId, LocalDateTime start, LocalDateTime end);

    Long countByProjectSpaceCodeAndProjectIdAndOpenedTrue(String spaceCode, Long projectId);

    Long countByProjectSpaceIdAndProjectIdAndOpenedTrue(Long spaceId, Long projectId);

    List<Testrun> findAllByDeadlineCloseTrueAndEndDateTimeNotNullAndEndDateTimeBeforeAndOpenedTrue(LocalDateTime endDateTime);

    @Modifying
    @Query("DELETE FROM Testrun tr WHERE tr.id = :testrunId")
    void deleteById(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("UPDATE Testrun tr SET tr.reserveExpired = :reserveExpired, tr.reserveResultId = :reserveResultId WHERE tr.id = :testrunId")
    void updateTestrunReserveExpired(@Param("testrunId") Long testrunId, @Param("reserveExpired") Boolean reserveExpired, @Param("reserveResultId") Long reserveResultId);

}

