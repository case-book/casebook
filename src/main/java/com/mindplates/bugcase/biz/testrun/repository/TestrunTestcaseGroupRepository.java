package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunTestcaseGroupRepository extends JpaRepository<TestrunTestcaseGroup, Long> {

    @Modifying
    @Query("DELETE FROM TestrunTestcaseGroup ttg WHERE ttg.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

}

