package com.mindplates.bugcase.biz.integration.repository;

import com.mindplates.bugcase.biz.integration.entity.Jira;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface JiraRepository extends JpaRepository<Jira, Long> {

    Optional<Jira> findBySpaceId(long spaceId);

    @Modifying
    @Query("DELETE FROM Jira j WHERE j.space.id = :spaceId")
    void deleteBySpaceId(long spaceId);
}
