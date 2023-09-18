package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TestcaseTemplateRepository extends JpaRepository<TestcaseTemplate, Long> {

    Optional<TestcaseTemplate> findAllByProjectIdAndDefaultTemplateTrue(Long projectId);


}

