package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestcaseTemplateRepository extends JpaRepository<TestcaseTemplate, Long> {

    Optional<TestcaseTemplate> findAllByProjectIdAndDefaultTemplateTrue(Long projectId);


}

