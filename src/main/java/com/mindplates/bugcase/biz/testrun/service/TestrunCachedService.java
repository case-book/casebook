package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunListDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.repository.TestrunRepository;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestrunCachedService {


    private final TestrunRepository testrunRepository;

    @Cacheable(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_SIMPLE_TESTRUNS)
    public List<TestrunListDTO> selectOpenedProjectTestrunList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(spaceCode, projectId, true);
        return list.stream().map(TestrunListDTO::new).collect(Collectors.toList());
    }

    @Cacheable(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT_OPENED_DETAIL_TESTRUNS)
    public List<TestrunDTO> selectOpenedProjectTestrunDetailList(String spaceCode, long projectId) {
        List<Testrun> list = testrunRepository.findAllByProjectSpaceCodeAndProjectIdAndOpenedOrderByStartDateTimeDescIdDesc(spaceCode, projectId, true);
        return list.stream().map(testrun -> new TestrunDTO(testrun, true)).collect(Collectors.toList());
    }

}
