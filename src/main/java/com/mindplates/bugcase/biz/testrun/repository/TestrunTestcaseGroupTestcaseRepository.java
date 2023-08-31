package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunTestcaseGroupTestcaseRepository extends JpaRepository<TestrunTestcaseGroupTestcase, Long> {

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
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testrunTestcaseGroup.id in (SELECT ttg.id from TestrunTestcaseGroup ttg where ttg.testcaseGroup.id in (:ids))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    Optional<TestrunTestcaseGroupTestcase> findAllByTestrunTestcaseGroupTestrunProjectIdAndTestrunTestcaseGroupTestrunIdAndTestcaseSeqId(
        Long projectId, Long testrunId, String seqId);

}

