package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestrunIterationRepository extends JpaRepository<TestrunIteration, Long> {

    List<TestrunIteration> findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByReserveStartDateTimeDescIdDesc(String spaceCode, Long projectId, Boolean expired);


}

