package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.testrun.dto.TestrunIterationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.repository.TestrunIterationRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunUserRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestrunIterationService {

    private final TestrunIterationRepository testrunIterationRepository;
    private final TestrunTestcaseGroupRepository testrunTestcaseGroupRepository;
    private final TestrunUserRepository testrunUserRepository;
    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;

    @Transactional
    @CacheEvict(key="'not_expired'", value = CacheConfig.TESTRUN_ITERATIONS)
    public TestrunIterationDTO createTestrunIterationInfo(TestrunIterationDTO testrunIteration) {
        int testcaseGroupCount = 0;
        int testcaseCount = 0;
        for (TestrunTestcaseGroupDTO testrunTestcaseGroup : testrunIteration.getTestcaseGroups()) {
            testcaseGroupCount += 1;
            testrunTestcaseGroup.setTestrunIteration(testrunIteration);
            if (testrunTestcaseGroup.getTestcases() != null) {
                for (TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase : testrunTestcaseGroup.getTestcases()) {
                    testcaseCount += 1;
                    testrunTestcaseGroupTestcase.setTestrunTestcaseGroup(testrunTestcaseGroup);
                }
            }
        }
        testrunIteration.setTestcaseGroupCount(testcaseGroupCount);
        testrunIteration.setTestcaseCount(testcaseCount);
        testrunIteration.setExpired(false);

        TestrunIteration result = testrunIterationRepository.save(testrunIteration.toEntity());
        return new TestrunIterationDTO(result, true);
    }


    public List<TestrunIterationDTO> selectProjectTestrunIterationList(String spaceCode, long projectId, Boolean expired) {
        List<TestrunIteration> list = testrunIterationRepository.findAllByProjectIdAndExpiredOrderByReserveStartDateTimeDescIdDesc(projectId, expired);
        return list.stream().map(TestrunIterationDTO::new).collect(Collectors.toList());
    }

    @Cacheable(key="'not_expired'", value = CacheConfig.TESTRUN_ITERATIONS)
    public List<TestrunIterationDTO> selectTestrunIterationList() {
        List<TestrunIteration> list = testrunIterationRepository.findAllByExpiredFalse();
        return list.stream().map((TestrunIterationDTO::new)).collect(Collectors.toList());
    }

    public TestrunIterationDTO selectTestrunIterationInfo(long id) {
        TestrunIteration testrunIteration = testrunIterationRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunIterationDTO(testrunIteration, true);
    }

    @Transactional
    @CacheEvict(key="'not_expired'", value = CacheConfig.TESTRUN_ITERATIONS)
    public void deleteProjectTestrunIterationInfo(String spaceCode, long projectId, long testrunIterationId) {
        testrunTestcaseGroupTestcaseRepository.deleteByTestrunIterationId(testrunIterationId);
        testrunUserRepository.deleteByTestrunIterationId(testrunIterationId);
        testrunTestcaseGroupRepository.deleteByTestrunIterationId(testrunIterationId);
        testrunIterationRepository.deleteById(testrunIterationId);
    }

    @Transactional
    @CacheEvict(key="'not_expired'", value = CacheConfig.TESTRUN_ITERATIONS)
    public void updateTestrunIterationExpired(Long testrunId, Boolean expired) {
        testrunIterationRepository.updateTestrunIterationExpired(testrunId, expired);
    }

    @Transactional
    @CacheEvict(key="'not_expired'", value = CacheConfig.TESTRUN_ITERATIONS)
    public TestrunIterationDTO updateTestrunIterationInfo(String spaceCode, TestrunIterationDTO testrunIteration, boolean updateIterationInfo) {

        TestrunIteration newTestrunIteration = testrunIteration.toEntity();
        TestrunIteration targetTestrunIteration = testrunIterationRepository.findById(testrunIteration.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestrunIteration.updateInfo(newTestrunIteration);
        targetTestrunIteration.updateTester(testrunIteration.getTestrunUsers());
        if (updateIterationInfo) {
            targetTestrunIteration.updateIterationInfo(testrunIteration);
        }

        // 삭제된 테스트런 테스트케이스 그룹 및 테스트케이스 제거
        targetTestrunIteration.updateTestcaseGroups(newTestrunIteration.getTestcaseGroups());

        int testcaseGroupCount = targetTestrunIteration.getTestcaseGroups().size();
        int testcaseCount = targetTestrunIteration.getTestcaseGroups().stream()
            .map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0)
            .reduce(0, Integer::sum);

        targetTestrunIteration.setTestcaseGroupCount(testcaseGroupCount);
        targetTestrunIteration.setTestcaseCount(testcaseCount);

        List<Long> currentFilteringUserIds = targetTestrunIteration.getCurrentFilteringUserIds();
        if (currentFilteringUserIds != null) {
            currentFilteringUserIds.removeIf((userId) -> testrunIteration.getTestrunUsers().stream().noneMatch((testrunUserDTO -> testrunUserDTO.getUser().getId().equals(userId))));
        }

        TestrunIteration result = testrunIterationRepository.save(targetTestrunIteration);
        return new TestrunIterationDTO(result);
    }

    @Transactional
    @CacheEvict(key="'not_expired'", value = CacheConfig.TESTRUN_ITERATIONS)
    public void deleteByProjectId(long projectId) {
        testrunIterationRepository.deleteByProjectId(projectId);
    }


}
