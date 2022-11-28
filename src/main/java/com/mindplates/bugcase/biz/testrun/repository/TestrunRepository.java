package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestrunRepository extends JpaRepository<Testrun, Long> {

    List<Testrun> findAllByProjectId(Long projectId);

}

