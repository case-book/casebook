package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TestcaseItemRepository extends JpaRepository<TestcaseItem, Long> {

    @Modifying
    @Query("DELETE FROM TestcaseItem ti WHERE ti.testcase.id = :testcaseId")
    void deleteByTestcaseId(@Param("testcaseId") Long testcaseId);

    @Modifying
    @Query("DELETE FROM TestcaseItem ti WHERE ti.testcase.id in (SELECT t.id from Testcase t where t.testcaseGroup.id in (:ids))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

}

