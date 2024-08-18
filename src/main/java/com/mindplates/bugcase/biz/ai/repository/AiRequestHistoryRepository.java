package com.mindplates.bugcase.biz.ai.repository;

import com.mindplates.bugcase.biz.ai.entity.AiRequestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AiRequestHistoryRepository extends JpaRepository<AiRequestHistory, Long> {


    @Modifying
    @Query("UPDATE AiRequestHistory arh SET arh.requester = NULL WHERE arh.requester.id = :userId")
    void updateTesterNullByUserId(@Param("userId") Long userId);
}

