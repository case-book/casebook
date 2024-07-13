package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestcaseItemRepository extends JpaRepository<TestcaseItem, Long> {

    @Modifying
    @Query("DELETE FROM TestcaseItem ti WHERE ti.testcase.id = :testcaseId")
    void deleteByTestcaseId(@Param("testcaseId") Long testcaseId);

    @Modifying
    @Query("DELETE FROM TestcaseItem ti WHERE ti.testcase.id in (SELECT t.id from Testcase t where t.testcaseGroup.id IN (:ids))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM TestcaseItem ti WHERE ti.testcaseTemplateItem.id = :testcaseTemplateItemId")
    void deleteByTestcaseTemplateItemId(@Param("testcaseTemplateItemId") Long testcaseTemplateItemId);

    @Modifying
    @Query("DELETE FROM TestcaseItem ti WHERE ti.testcaseTemplateItem.id IN (SELECT tti.id FROM TestcaseTemplateItem tti WHERE tti.testcaseTemplate.id = :testcaseTemplateId)")
    void deleteByTestcaseTemplateId(@Param("testcaseTemplateId") Long testcaseTemplateId);

    List<TestcaseItem> findByTestcaseProjectId(Long projectId);

    @Modifying
    @Query("DELETE FROM TestcaseItem ti WHERE ti.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);
}

