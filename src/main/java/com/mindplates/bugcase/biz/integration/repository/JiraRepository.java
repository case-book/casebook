package com.mindplates.bugcase.biz.integration.repository;

import com.mindplates.bugcase.biz.integration.entity.Jira;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JiraRepository extends JpaRepository<Jira, Long> {

    Jira findBySpaceId(long spaceId);
}
