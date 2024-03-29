package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
            "(SELECT ttgt.id from TestrunTestcaseGroupTestcase ttgt where ttgt.testrunTestcaseGroup.id in (SELECT ttg.id from TestrunTestcaseGroup ttg where ttg.testcaseGroup.id in (:ids)))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);
}

