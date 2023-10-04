package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectReleaseId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestcaseProjectReleaseRepository extends JpaRepository<TestcaseProjectRelease, TestcaseProjectReleaseId> {
    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.projectRelease.id = :id")
    void deleteByProjectReleaseId(@Param("id") Long id);

}

