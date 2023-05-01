package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.common.code.TestrunCreationTypeCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestrunReservationRepository extends JpaRepository<TestrunReservation, Long> {

    List<TestrunReservation> findAllByProjectSpaceCodeAndProjectIdAndExpiredOrderByStartDateTimeDescIdDesc(String spaceCode, Long projectId, Boolean expired);

}

