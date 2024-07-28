package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseHistoryDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseTesterDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.common.code.TestResultCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunTestcaseGroupTestcaseRepository extends JpaRepository<TestrunTestcaseGroupTestcase, Long> {

    @EntityGraph(attributePaths = {"tester", "testrunTestcaseGroup", "testcase", "testcaseItems"})
    Optional<TestrunTestcaseGroupTestcase> findById(long id);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt where ttgt.testrunTestcaseGroup.id in " +
        "(SELECT ttg.id from TestrunTestcaseGroup ttg where ttg.testrun.id = :testrunId)")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt where ttgt.testrunTestcaseGroup.id in " +
        "(SELECT ttg.id from TestrunTestcaseGroup ttg where ttg.testrunReservation.id = :testrunReservationId)")
    void deleteByTestrunReservationId(@Param("testrunReservationId") Long testrunReservationId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt where ttgt.testrunTestcaseGroup.id in " +
        "(SELECT ttg.id from TestrunTestcaseGroup ttg where ttg.testrunIteration.id = :testrunIterationId)")
    void deleteByTestrunIterationId(@Param("testrunIterationId") Long testrunIterationId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id = :testcaseId")
    void deleteByTestcaseId(@Param("testcaseId") Long testcaseId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testcase.id in (SELECT t.id FROM Testcase t WHERE t.testcaseGroup.id IN (:ids))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testcase.id in (SELECT t.id from Testcase t where t.testcaseTemplate.id = :id)")
    void deleteByTestcaseTemplateId(@Param("id") Long id);

    @Modifying
    @Query("UPDATE TestrunTestcaseGroupTestcase ttgt SET ttgt.tester = NULL WHERE ttgt.tester.id = :userId")
    void updateTesterNullByUserId(@Param("userId") Long userId);

    Optional<TestrunTestcaseGroupTestcase> findAllByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(
        Long projectId, Long testrunId, String seqId);

    @Query("SELECT new TestrunTestcaseGroupTestcase(ttgt.id, ttgt.tester.id, ttgt.testResult) FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testResult = :testResultCode AND ttgt.testrunTestcaseGroup IN (SELECT ttg.id FROM TestrunTestcaseGroup ttg WHERE ttg.testrun.id = :testrunId)")
    List<TestrunTestcaseGroupTestcase> findAllByTestrunTestcaseGroupTestrunIdAndTestResult(Long testrunId, TestResultCode testResultCode);

    @Query("SELECT new com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseHistoryDTO(ttgt.id, ttgt.testrunTestcaseGroup.testrun.id, ttgt.testrunTestcaseGroup.id, ttgt.testcase.id, ttgt.testResult) FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testcase.id = :testcaseId AND ttgt.testrunTestcaseGroup.testrun.id != :currentTestrunId ORDER BY ttgt.creationDate DESC")
    List<TestrunTestcaseGroupTestcaseHistoryDTO> selectTopNTestrunTestcaseGroupTestcaseHistoryList(Long testcaseId, Long currentTestrunId, Pageable Pageable);


    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("UPDATE TestrunTestcaseGroupTestcase ttgt SET ttgt.tester.id = NULL WHERE ttgt.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.project.id = :projectId) AND  ttgt.tester.id = :userId")
    void updateProjectTesterNullByUserId(@Param("projectId") Long projectId, @Param("userId") Long userId);

    @Query("SELECT ttgt.id FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testrunTestcaseGroup.testrun.project.id = :projectId AND ttgt.testrunTestcaseGroup.testrun.id = :testrunId AND ttgt.testcase.seqId = :seqId")
    Optional<Long> findTestrunTestcaseGroupTestcaseIdByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(Long projectId, Long testrunId, String seqId);

    @Query("SELECT new com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseTesterDTO(ttgt.id, ttgt.testcase.name , ttgt.tester.id, ttgt.testResult) FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testrunTestcaseGroup.testrun.id = :testrunId AND ttgt.tester.id = :testerId")
    List<TestrunTestcaseGroupTestcaseTesterDTO> findTestrunTestcaseGroupTestcaseByTesterId(long testrunId, Long testerId);

    @Modifying
    @Query("UPDATE TestrunTestcaseGroupTestcase ttgt SET ttgt.tester.id = :testerId WHERE ttgt.id = :testrunTestcaseGroupTestcaseId")
    void updateTesterById(@Param("testrunTestcaseGroupTestcaseId") Long testrunTestcaseGroupTestcaseId, @Param("testerId") Long testerId);

}

