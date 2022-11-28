package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.repository.TestrunRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TestrunService {

    private final TestrunRepository testrunRepository;

    public List<Testrun> selectProjectTestrunList(long projectId) {
        return testrunRepository.findAllByProjectId(projectId);
    }

}
