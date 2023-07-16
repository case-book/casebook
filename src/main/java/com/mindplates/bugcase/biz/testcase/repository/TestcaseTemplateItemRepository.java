package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestcaseTemplateItemRepository extends JpaRepository<TestcaseTemplateItem, Long> {

    List<TestcaseTemplateItem> findByTestcaseTemplateProjectId(Long projectId);

}

