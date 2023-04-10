package com.mindplates.bugcase.biz.testrun.repository;


import com.mindplates.bugcase.biz.testrun.entity.TestrunParticipant;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.util.List;

public interface TestrunParticipantRedisRepository extends CrudRepository<TestrunParticipant, String>, QueryByExampleExecutor<TestrunParticipant> {
    List<TestrunParticipant> findAllBySpaceCodeAndProjectIdAndTestrunId(String spaceCode, Long projectId, Long testrunId);

    List<TestrunParticipant> findAllByTestrunIdAndUserId(Long testrunId, Long userId);

}
