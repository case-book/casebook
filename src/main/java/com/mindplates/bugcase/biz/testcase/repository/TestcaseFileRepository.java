package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TestcaseFileRepository extends JpaRepository<TestcaseFile, Long> {

    Optional<TestcaseFile> findByProjectIdAndId(Long projectId, Long imageId);

    Optional<TestcaseFile> findByIdAndProjectIdAndTestcaseIdAndUuid(Long imageId, Long projectId, Long testcaseId, String uuid);

    @Modifying
    @Query("DELETE FROM TestcaseFile tif WHERE tif.testcase.id = :testcaseId")
    void deleteByTestcaseId(@Param("testcaseId") Long testcaseId);

    @Modifying
    @Query("DELETE FROM TestcaseFile tif WHERE tif.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("DELETE FROM TestcaseFile tif WHERE tif.testcase.id IN (SELECT t.id from Testcase t where t.testcaseGroup.id in (:ids))")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    List<TestcaseFile> findAllByTestcaseId(Long testcaseId);

    List<TestcaseFile> findAllByProjectId(Long projectId);

    List<TestcaseFile> findAllByTestcaseTestcaseGroupIdIn(List<Long> ids);


}

