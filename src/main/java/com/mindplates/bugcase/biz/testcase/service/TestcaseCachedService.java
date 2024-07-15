package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseGroupRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TestcaseCachedService {

    private final TestcaseGroupRepository testcaseGroupRepository;
    private final TestcaseRepository testcaseRepository;
    private final UserRepository userRepository;

    @Cacheable(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS)
    public List<TestcaseGroupDTO> selectTestcaseGroupList(Long projectId) {
        List<TestcaseGroup> testcaseGroups = testcaseGroupRepository.findAllByProjectId(projectId);
        return testcaseGroups.stream().map((TestcaseGroupDTO::new)).collect(Collectors.toList());
    }

    @Cacheable(key = "{#projectId, #testcaseId}", value = CacheConfig.PROJECT_TESTCASE)
    public TestcaseDTO selectTestcaseInfo(Long projectId, Long testcaseId) {
        Testcase testcase = testcaseRepository.findByIdAndProjectId(testcaseId, projectId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        User createdUser = null;
        if (testcase.getCreatedBy() != null) {
            createdUser = userRepository.findById(testcase.getCreatedBy()).orElse(null);
        }
        User lastUpdatedUser = null;
        if (testcase.getLastUpdatedBy() != null) {
            lastUpdatedUser = userRepository.findById(testcase.getLastUpdatedBy()).orElse(null);
        }

        return new TestcaseDTO(testcase, createdUser, lastUpdatedUser);
    }


}
