package com.mindplates.bugcase.biz.integration.repository;

import com.mindplates.bugcase.biz.integration.entity.JiraIntegration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JiraIntegrationRepository extends JpaRepository<JiraIntegration, Long> {

}
