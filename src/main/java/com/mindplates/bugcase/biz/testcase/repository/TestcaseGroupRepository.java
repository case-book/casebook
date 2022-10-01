package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestcaseGroupRepository extends JpaRepository<TestcaseGroup, Long> {
    List<TestcaseGroup> findAllByProjectIdAndParentId(Long projectId, Long parentId);

    boolean existsByIdAndProjectId(Long id, Long projectId);

    Optional<TestcaseGroup> findByIdAndProjectId(Long id, Long projectId);

}

