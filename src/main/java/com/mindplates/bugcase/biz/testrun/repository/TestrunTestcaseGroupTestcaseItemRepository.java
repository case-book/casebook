package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunTestcaseGroupTestcaseItemRepository extends JpaRepository<TestrunTestcaseGroupTestcaseItem, Long> {

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseItem ttgti WHERE ttgti.testrunTestcaseGroupTestcase.id IN " +
        "(SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testrunTestcaseGroup.id in " +
        "(SELECT ttg.id from TestrunTestcaseGroup ttg where ttg.testrun.id = :testrunId))")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseItem ttgti WHERE ttgti.testcaseTemplateItem.id = :testcaseTemplateItemId")
    void deleteByTestcaseTemplateItemId(@Param("testcaseTemplateItemId") Long testcaseTemplateItemId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseItem ttgti WHERE ttgti.testrunTestcaseGroupTestcase.id IN (select ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id = :testcaseId)")
    void deleteByTestcaseId(@Param("testcaseId") Long testcaseId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseItem ttgti WHERE ttgti.testrunTestcaseGroupTestcase.id IN " +
        "(SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id in (SELECT t.id from Testcase t where t.testcaseGroup.id in (:ids)))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseItem ttgti WHERE ttgti.testrunTestcaseGroupTestcase.id IN (SELECT ttgt.id FROM TestrunTestcaseGroupTestcase ttgt WHERE ttgt.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.project.id = :projectId))")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroupTestcaseItem ttgti WHERE ttgti.testrunTestcaseGroupTestcase.id IN (SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.testcaseTemplate.id = :testcaseTemplateId))")
    void deleteByTestcaseTemplateId(long testcaseTemplateId);

}

