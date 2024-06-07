package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.ProjectMessageChannel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectMessageChannelRepository extends JpaRepository<ProjectMessageChannel, Long> {


    List<ProjectMessageChannel> findAllByProjectId(Long projectId);

    @Modifying
    @Query("DELETE FROM ProjectMessageChannel pmc WHERE pmc.messageChannel.id = :spaceMessageChannelId")
    void deleteBySpaceMessageChannelId(@Param("spaceMessageChannelId") Long spaceMessageChannelId);

    List<ProjectMessageChannel> findAllByMessageChannelId(Long spaceMessageChannelId);


}

