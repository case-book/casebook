package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunMessageChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunMessageChannelRepository extends JpaRepository<TestrunMessageChannel, Long> {


    @Modifying
    @Query("DELETE FROM TestrunMessageChannel tmc WHERE tmc.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunMessageChannel tmc WHERE tmc.messageChannel.id = :projectMessageChannelId")
    void deleteByProjectMessageChannelId(@Param("projectMessageChannelId") Long projectMessageChannelId);

    @Modifying
    @Query("DELETE FROM TestrunMessageChannel tmc WHERE tmc.messageChannel.id IN (SELECT pmc.id FROM ProjectMessageChannel pmc WHERE pmc.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);
}

