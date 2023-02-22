package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
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
    @Query("DELETE FROM TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id = :testcaseId")
    void deleteByTestcaseId(@Param("testcaseId") Long testcaseId);

}

