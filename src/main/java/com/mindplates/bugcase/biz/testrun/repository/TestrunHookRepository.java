package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunHook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunHookRepository extends JpaRepository<TestrunHook, Long> {


    @Modifying
    @Query("DELETE FROM TestrunHook th WHERE th.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);


}

