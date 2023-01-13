package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TestrunRepository extends JpaRepository<Testrun, Long> {

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdOrderByEndDateTimeDescIdDesc(String spaceCode, Long projectId);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByEndDateTimeDescIdDesc(String spaceCode, Long projectId, boolean opened);

    List<Testrun> findAllByProjectSpaceCodeAndProjectIdAndStartDateTimeAfterAndEndDateTimeBeforeOrderByEndDateTimeDescIdDesc(String spaceCode, Long projectId, LocalDateTime start, LocalDateTime end);

    Long countByProjectSpaceCodeAndProjectId(String spaceCode, Long projectId);

    Long countByProjectSpaceIdAndProjectId(Long spaceId, Long projectId);

    @Modifying
    @Query("DELETE FROM Testrun tr WHERE tr.id = :testrunId")
    void deleteById(@Param("testrunId") Long testrunId);

}

