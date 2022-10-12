package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestcaseTemplateRepository extends JpaRepository<TestcaseTemplate, Long> {
    List<TestcaseTemplate> findAllByProjectId(Long projectId);

    Optional<TestcaseTemplate> findAllByProjectIdAndIsDefaultTrue(Long projectId);

}

