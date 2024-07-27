package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.dto.TestrunCountSummaryDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseIdTestrunIdDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunRepository extends JpaRepository<Testrun, Long> {

    String TESTRUN_LIST_PROJECTION = "SELECT new Testrun(tr.id, tr.seqId, tr.name, tr.description, tr.project.id, tr.startDateTime, tr.endDateTime, tr.opened, tr.totalTestcaseCount, tr.passedTestcaseCount, tr.failedTestcaseCount, tr.untestableTestcaseCount, tr.closedDate, tr.days, tr.excludeHoliday, tr.startTime, tr.durationHours, tr.reserveExpired, tr.reserveResultId, tr.deadlineClose, tr.autoTestcaseNotAssignedTester) FROM Testrun tr ";

    Optional<Testrun> findAllByProjectIdAndSeqId(Long projectId, String seqId);

    @Query("SELECT tr.id FROM Testrun tr WHERE tr.project.id = :projectId AND tr.seqId = :seqId")
    Optional<Long> findTestrunIdByProjectIdAndSeqId(Long projectId, String seqId);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(String spaceCode, Long projectId, boolean opened);

    @Query(TESTRUN_LIST_PROJECTION
        + " WHERE tr.project.id = :projectId AND tr.opened = :opened AND ((tr.startDateTime >= :start AND tr.startDateTime < :end) OR (tr.endDateTime >= :start AND tr.endDateTime < :end)) ORDER BY tr.startDateTime DESC, tr.id DESC")
    List<Testrun> findProjectTestrunByOpenedAndRange(Long projectId, boolean opened, LocalDateTime start, LocalDateTime end);

    @Query(TESTRUN_LIST_PROJECTION + " WHERE tr.project.id = :projectId AND tr.opened = :opened ORDER BY tr.endDateTime DESC")
    List<Testrun> findTopNProjectTestrunByOpened(Long projectId, boolean opened, Pageable pageable);

    @Query(TESTRUN_LIST_PROJECTION + " WHERE tr.project.id = :projectId AND tr.startDateTime >= :start AND tr.endDateTime < :end ORDER BY tr.startDateTime DESC, tr.id DESC")
    List<Testrun> findAllByProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByStartDateTimeDescIdDesc(Long projectId, LocalDateTime start, LocalDateTime end);

    @Query(value = TESTRUN_LIST_PROJECTION + " WHERE tr.deadlineClose = true AND tr.opened = true AND tr.endDateTime IS NOT NULL AND tr.endDateTime < :endDateTime")
    List<Testrun> findToBeClosedTestrunList(LocalDateTime endDateTime);

    @Query(value = "SELECT tr.endDateTime FROM Testrun tr WHERE tr.id = :testrunId")
    Optional<LocalDateTime> findEndDateTimeById(long testrunId);

    @Query(value = TESTRUN_LIST_PROJECTION + " WHERE tr.opened = true AND tr.endDateTime IS NOT NULL")
    List<Testrun> findAllByOpenedTrueAndEndDateTimeNotNull();

    @Query(value = "SELECT tr.opened FROM Testrun tr WHERE tr.id = :testrunId")
    boolean findOpenedById(Long testrunId);

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
    List<Long> findTestrunSeqNoByProjectIdAndTestcaseSeqId(Long projectId, String seqId);


    @Query("SELECT new com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseIdTestrunIdDTO(tr.id, tr.seqId, ttgt.id) FROM Testrun tr INNER JOIN TestrunTestcaseGroup ttg ON tr.id = ttg.testrun.id INNER JOIN TestrunTestcaseGroupTestcase ttgt ON ttg.id = ttgt.testrunTestcaseGroup.id WHERE ttgt.id = :testrunTestcaseGroupTestcaseId")
    TestrunTestcaseGroupTestcaseIdTestrunIdDTO findTestrunTestcaseGroupTestcaseId(long testrunTestcaseGroupTestcaseId);

    @Query("SELECT new com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseIdTestrunIdDTO(tr.id, tr.seqId, ttgt.id) FROM Testrun tr INNER JOIN TestrunTestcaseGroup ttg ON tr.id = ttg.testrun.id INNER JOIN TestrunTestcaseGroupTestcase ttgt ON ttg.id = ttgt.testrunTestcaseGroup.id WHERE ttgt.id IN (:testrunTestcaseGroupTestcaseIds)")
    List<TestrunTestcaseGroupTestcaseIdTestrunIdDTO> findTestrunTestcaseGroupTestcaseIdsList(List<Long> testrunTestcaseGroupTestcaseIds);


    @Modifying
    @Query("DELETE FROM Testrun tr WHERE tr.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT new com.mindplates.bugcase.biz.testrun.dto.TestrunCountSummaryDTO(tr.id, tr.seqId, tr.name, tr.project.id, tr.totalTestcaseCount, tr.passedTestcaseCount, tr.failedTestcaseCount, tr.untestableTestcaseCount) FROM Testrun tr WHERE tr.id = :testrunId")
    TestrunCountSummaryDTO findTestrunCountSummary(long testrunId);

    @Modifying
    @Query("UPDATE Testrun tr SET tr.opened = :opened WHERE tr.id = :testrunId")
    void updateTestrunOpened(@Param("testrunId") long testrunId, @Param("opened") boolean opened);

    @Modifying
    @Query("UPDATE Testrun tr SET tr.passedTestcaseCount = :passedTestcaseCount, tr.failedTestcaseCount = :failedTestcaseCount, tr.untestableTestcaseCount = :untestableTestcaseCount WHERE tr.id = :testrunId")
    void updateTestrunCountSummary(@Param("testrunId") long testrunId, @Param("passedTestcaseCount") int passedTestcaseCount, @Param("failedTestcaseCount") int failedTestcaseCount,
        @Param("untestableTestcaseCount") int untestableTestcaseCount);

    @Query("SELECT tr.name FROM Testrun tr WHERE tr.id = :testrunId")
    Optional<String> findNameById(long testrunId);
}

