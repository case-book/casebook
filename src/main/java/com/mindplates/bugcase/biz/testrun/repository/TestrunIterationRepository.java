package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunIterationRepository extends JpaRepository<TestrunIteration, Long> {

    String TESTRUN_ITERATION_LIST_PROJECTION = "SELECT new TestrunIteration(ti.id, ti.name, ti.description, ti.project.id, ti.reserveStartDateTime, ti.reserveEndDateTime, ti.testrunIterationTimeType, ti.excludeHoliday, ti.durationHours, ti.expired, ti.days, ti.startTime, ti.date, ti.week, ti.day, ti.testrunIterationUserFilterType, ti.testrunIterationUserFilterSelectRule, ti.filteringUserCount, ti.testcaseGroupCount, ti.testcaseCount, ti.deadlineClose, ti.autoTestcaseNotAssignedTester, ti.addConnectedSequenceTestcase, ti.assignSequenceTestcaseSameTester, (SELECT COUNT(tu.id) FROM TestrunUser tu WHERE tu.testrunIteration.id = ti.id)) FROM TestrunIteration ti ";

    @Query(value = TESTRUN_ITERATION_LIST_PROJECTION + " WHERE ti.project.id = :projectId AND ti.expired = :expired ORDER BY ti.reserveStartDateTime DESC, ti.id DESC")
    List<TestrunIteration> findAllByProjectIdAndExpiredOrderByReserveStartDateTimeDescIdDesc(Long projectId, Boolean expired);

    @Query(value = TESTRUN_ITERATION_LIST_PROJECTION + " WHERE ti.expired = false")
    List<TestrunIteration> findAllByExpiredFalse();

    @Modifying
    @Query("UPDATE TestrunIteration tri SET tri.expired = :expired WHERE tri.id = :testrunIterationId")
    void updateTestrunIterationExpired(@Param("testrunIterationId") Long testrunIterationId, @Param("expired") Boolean expired);

    @Modifying
    @Query("UPDATE TestrunIteration tri SET tri.filteringUserCursor = :filteringUserCursor, tri.currentFilteringUserIds = :currentFilteringUserIds WHERE tri.id = :testrunIterationId")
    void updateTestrunIterationUserCursor(@Param("testrunIterationId") Long testrunIterationId, @Param("filteringUserCursor") Integer filteringUserCursor,
        @Param("currentFilteringUserIds") List<Long> currentFilteringUserIds);

    @Modifying
    @Query("DELETE FROM TestrunIteration ti WHERE ti.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

}

