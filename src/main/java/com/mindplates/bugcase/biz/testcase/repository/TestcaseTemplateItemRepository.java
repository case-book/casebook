package com.mindplates.bugcase.biz.testcase.repository;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestcaseTemplateItemRepository extends JpaRepository<TestcaseTemplateItem, Long> {

    List<TestcaseTemplateItem> findByTestcaseTemplateProjectId(Long projectId);

}

