package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestcaseGroupRepository extends JpaRepository<TestcaseGroup, Long> {

    List<TestcaseGroup> findAllByProjectIdAndParentId(Long projectId, Long parentId);

    int countByProjectIdAndParentId(Long projectId, Long parentId);

    List<TestcaseGroup> findAllByProjectId(Long projectId);

    Optional<TestcaseGroup> findByIdAndProjectId(Long id, Long projectId);

    @Query(value = "SELECT tg.depth FROM TestcaseGroup tg WHERE tg.id = :id AND tg.project.id = :projectId")
    Optional<Long> findDepthByIdAndProjectId(Long id, Long projectId);

    @Modifying
    @Query("DELETE FROM TestcaseGroup tg WHERE tg.id = :id")
    void deleteById(@Param("id") Long id);

    @Modifying
    @Query("DELETE FROM TestcaseGroup tg WHERE tg.id IN (:ids)")
    void deleteByIds(@Param("ids") List<Long> ids);

    @Query(value = "SELECT MAX(tg.itemOrder) FROM TestcaseGroup tg WHERE tg.parentId = :parentId")
    Integer selectParentTestcaseGroupMaxItemOrder(Long parentId);

    @Modifying
    @Query("DELETE FROM TestcaseGroup tg WHERE tg.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
}

