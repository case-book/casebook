package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectReleaseId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestcaseProjectReleaseRepository extends JpaRepository<TestcaseProjectRelease, TestcaseProjectReleaseId> {

    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.projectRelease.id = :projectReleaseId AND tpr.testcase.id = :testcaseId")
    void deleteByProjectReleaseIdAndTestcaseId(@Param("projectReleaseId") Long projectReleaseId, @Param("testcaseId") Long testcaseId);
    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.projectRelease.id = :id")
    void deleteByProjectReleaseId(@Param("id") Long id);

    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.testcase.id = :id")
    void deleteByTestcaseId(@Param("id") Long id);

    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.testcaseGroup.id IN (:ids))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.testcase.id = :testcaseId AND tpr.projectRelease.id = :projectReleaseId")
    void deleteByTestcaseIdAndProjectReleaseId(@Param("testcaseId") Long testcaseId, @Param("projectReleaseId") Long projectReleaseId);


    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.testcase.id IN (SELECT t.id FROM Testcase t WHERE t.testcaseTemplate.id = :id)")
    void deleteByTestcaseTemplateId(Long id);

    @Modifying
    @Query("DELETE FROM TestcaseProjectRelease tpr WHERE tpr.projectRelease.id IN (SELECT pr.id FROM ProjectRelease pr WHERE pr.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);

}

