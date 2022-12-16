package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunTestcaseGroupTestcaseCommentRepository extends JpaRepository<TestrunTestcaseGroupTestcaseComment, Long> {

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseComment ttgtc where ttgtc.id = :testrunTestcaseGroupTestcaseCommentId")
    void deleteById(@Param("testrunTestcaseGroupTestcaseCommentId") Long testrunTestcaseGroupTestcaseCommentId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseComment ttgtc WHERE ttgtc.testrunTestcaseGroupTestcase.id IN " +
            "(SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testrunTestcaseGroup.id in " +
            "(SELECT ttg.id from TestrunTestcaseGroup ttg where ttg.testrun.id = :testrunId))")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

}

