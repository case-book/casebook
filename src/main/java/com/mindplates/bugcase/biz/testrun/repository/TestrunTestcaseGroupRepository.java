package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TestrunTestcaseGroupRepository extends JpaRepository<TestrunTestcaseGroup, Long> {

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testcaseGroup.id = :testcaseGroupId")
    void deleteByTestcaseGroupId(@Param("testcaseGroupId") Long testcaseGroupId);

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testcaseGroup.id IN (:ids)")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

}

