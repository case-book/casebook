package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
import java.util.List;
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

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseComment ttgtc WHERE ttgtc.testrunTestcaseGroupTestcase.id IN " +
        "(SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id in (SELECT t.id from Testcase t where t.testcaseGroup.id in (:ids)))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseComment ttgtc WHERE ttgtc.testrunTestcaseGroupTestcase.id IN " +
        "(SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id = :testcaseId)")
    void deleteByTestcaseId(@Param("testcaseId") Long testcaseId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseComment ttgtc WHERE ttgtc.testrunTestcaseGroupTestcase.id IN " +
        "(SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.testcaseTemplate.id = :testcaseTemplateId))")
    void deleteByTestcaseTemplateId(@Param("testcaseTemplateId") Long testcaseTemplateId);

    void deleteByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseComment ttgtc WHERE ttgtc.testrunTestcaseGroupTestcase.id IN (SELECT ttgt.id FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.project.id = :projectId))")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("UPDATE TestrunTestcaseGroupTestcaseComment ttgtc SET ttgtc.user.id = NULL WHERE ttgtc.user.id = :userId AND ttgtc.testrunTestcaseGroupTestcase.id IN (SELECT ttgt.id FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.project.id = :projectId))")
    void updateProjectTestrunTestcaseGroupTestcaseCommentUserNullByUserId(@Param("projectId") Long projectId, @Param("userId") Long userId);
}

