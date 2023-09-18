package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunRepository extends JpaRepository<Testrun, Long> {

    Optional<Testrun> findAllByProjectIdAndId(Long projectId, Long testrunId);
    Optional<Testrun> findAllByProjectIdAndSeqId(Long projectId, String seqId);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdOrderByEndDateTimeDescIdDesc(String spaceCode, Long projectId);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(String spaceCode, Long projectId, boolean opened);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndOpenedAndStartDateTimeAfterAndStartDateTimeBeforeOrProjectSpaceCodeAndProjectIdAndOpenedAndEndDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(
        String spaceCode1, Long projectId1, boolean opened1, LocalDateTime start1, LocalDateTime end1, String spaceCode2, Long projectId2,
        boolean opened2, LocalDateTime start2, LocalDateTime end2);

    List<Testrun> findTop3ByProjectSpaceCodeAndProjectIdAndOpenedOrderByEndDateTimeDesc(String spaceCode, Long projectId, boolean opened);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(String spaceCode,
        Long projectId, LocalDateTime start, LocalDateTime end);

    Long countByProjectSpaceCodeAndProjectIdAndOpenedTrue(String spaceCode, Long projectId);

    Long countByProjectSpaceIdAndProjectIdAndOpenedTrue(Long spaceId, Long projectId);

    List<Testrun> findAllByDeadlineCloseTrueAndEndDateTimeNotNullAndEndDateTimeBeforeAndOpenedTrue(LocalDateTime endDateTime);

    @Modifying
    @Query("DELETE FROM Testrun tr WHERE tr.id = :testrunId")
    void deleteById(@Param("testrunId") Long testrunId);

    @Query("SELECT new java.lang.Long(SUBSTRING(t.seqId,2, LENGTH(t.seqId))) FROM Testrun t " +
        "WHERE t.opened = true " +
        "AND t.id IN (SELECT ttg.testrun.id FROM TestrunTestcaseGroup ttg " +
        "                                  WHERE ttg.testrun.id IS NOT NULL " +
        "                                    AND ttg.id IN (SELECT ttgt.testrunTestcaseGroup.id " +
        "                                                     FROM TestrunTestcaseGroupTestcase ttgt " +
        "                                                    WHERE ttgt.testcase.id IN (SELECT t.id FROM Testcase t " +
        "                                                                                WHERE t.seqId = :seqId " +
        "                                                                                  AND t.project.id = :projectId ))) ")
    List<Long> findAllByProjectIdAndTestcaseSeqId(Long projectId, String seqId);

    List<Testrun> findAllByOpenedTrueAndEndDateTimeNotNull();

}

