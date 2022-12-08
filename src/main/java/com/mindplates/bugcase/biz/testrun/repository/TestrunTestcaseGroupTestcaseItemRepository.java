package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestrunTestcaseGroupTestcaseItemRepository extends JpaRepository<TestrunTestcaseGroupTestcaseItem, Long> {


}

