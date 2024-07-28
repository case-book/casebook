package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestcaseRepository extends JpaRepository<Testcase, Long> {

    @Query(value = "SELECT MAX(t.itemOrder) FROM Testcase t WHERE t.testcaseGroup.id = :testcaseGroupId")
    Integer selectTestcaseGroupMaxItemOrder(Long testcaseGroupId);

    @Modifying
    @Query("DELETE FROM Testcase t WHERE t.testcaseGroup.id IN (:ids)")
    void deleteByTestcaseGroupIds(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM Testcase t WHERE t.id = :id")
    void deleteById(@Param("id") Long id);

    @Modifying
    @Query("DELETE FROM Testcase t WHERE t.testcaseTemplate.id = :id")
    void deleteByTestcaseTemplateId(@Param("id") Long id);

    Optional<Testcase> findByIdAndProjectId(Long id, Long projectId);

    @Query(value = "SELECT new Testcase(t.id, t.seqId, t.name) FROM Testcase t WHERE t.project.id = :projectId")
    List<Testcase> findNameByProjectId(Long projectId);

    List<Testcase> findByProjectId(Long projectId);

    Long countByProjectSpaceCodeAndProjectId(String spaceCode, Long projectId);

    Long countByProjectSpaceIdAndProjectId(Long spaceId, Long projectId);

    List<Testcase> findAllByProjectIdAndCreationDateBetween(Long projectId, LocalDateTime from, LocalDateTime to);

    List<Testcase> findAllByProjectIdAndContentUpdateDateBetween(Long projectId, LocalDateTime from, LocalDateTime to);

    List<Testcase> findByIdIn(List<Long> ids);

    @Modifying
    @Query("DELETE FROM Testcase t WHERE t.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("UPDATE Testcase t SET t.itemOrder = t.itemOrder + 1 WHERE t.testcaseGroup.id = :testcaseGroupId")
    void increaseTestcaseItemOrderByTestcaseGroupId(long testcaseGroupId);

    @Modifying
    @Query("UPDATE Testcase t SET t.itemOrder = t.itemOrder + 1 WHERE t.testcaseGroup.id = :testcaseGroupId AND t.itemOrder > :itemOrder")
    void increaseTestcaseItemOrderByTestcaseGroupIdAndItemOrder(long testcaseGroupId, int itemOrder);

    @Query(value = "SELECT t.itemOrder FROM Testcase t WHERE t.id = :testcaseId")
    Integer findItemOrderByTestcaseId(Long testcaseId);

    @Query(value = "SELECT t.testcaseGroup.id FROM Testcase t WHERE t.id = :testcaseId")
    Long findTestcaseGroupIdByTestcaseId(Long testcaseId);

    @Modifying
    @Query("UPDATE Testcase t SET t.testcaseGroup.id = :testcaseGroupId, t.itemOrder = :itemOrder  WHERE t.id = :testcaseId")
    void updateTestcaseGroupAndOrder(long testcaseId, long testcaseGroupId, int itemOrder);

    int countByTestcaseGroupId(long testcaseGroupId);

}

