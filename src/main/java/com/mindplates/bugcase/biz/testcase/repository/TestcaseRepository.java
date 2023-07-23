package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TestcaseRepository extends JpaRepository<Testcase, Long> {

    @Query(value = "SELECT MAX(t.itemOrder) FROM Testcase t WHERE t.testcaseGroup.id = :testcaseGroupId")
    Integer selectTestcaseGroupMaxItemOrder(Long testcaseGroupId);

    @Modifying
    @Query("DELETE FROM Testcase t WHERE t.testcaseGroup.id IN (:ids)")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM Testcase t WHERE t.id = :id")
    void deleteById(@Param("id") Long id);

    Optional<Testcase> findByIdAndProjectId(Long id, Long projectId);

    List<Testcase> findByProjectId(Long projectId);

    Long countByProjectSpaceCodeAndProjectId(String spaceCode, Long projectId);

    Long countByProjectSpaceIdAndProjectId(Long spaceId, Long projectId);

    List<Testcase> findAllByProjectIdAndCreationDateBetween(Long projectId, LocalDateTime from, LocalDateTime to);

    List<Testcase> findAllByProjectIdAndContentUpdateDateBetween(Long projectId, LocalDateTime from, LocalDateTime to);



}

