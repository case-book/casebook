package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseGroupRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseTemplateRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TestcaseService {

    private final TestcaseTemplateRepository testcaseTemplateRepository;

    private final TestcaseGroupRepository testcaseGroupRepository;


    public List<TestcaseTemplate> selectTestcaseTemplateItemList(Long projectId) {
        return testcaseTemplateRepository.findAllByProjectId(projectId);
    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public List<TestcaseTemplate> saveTestcaseTemplateItemList(String spaceCode, Long projectId, List<TestcaseTemplate> testcaseTemplates, Long userId) {

        testcaseTemplates.stream().filter((TestcaseTemplate::isDeleted)).forEach((testcaseTemplate -> {
            testcaseTemplateRepository.delete(testcaseTemplate);
        }));

        LocalDateTime now = LocalDateTime.now();
        testcaseTemplates.stream().filter((testcaseTemplate -> !testcaseTemplate.isDeleted())).forEach((testcaseTemplate -> {
            if (testcaseTemplate.getId() == null) {
                testcaseTemplate.setCreationDate(now);
                testcaseTemplate.setCreatedBy(userId);
            }

            testcaseTemplate.setLastUpdateDate(now);
            testcaseTemplate.setLastUpdatedBy(userId);
        }));


        testcaseTemplateRepository.saveAll(testcaseTemplates.stream().filter((testcaseTemplate -> !testcaseTemplate.isDeleted())).collect(Collectors.toList()));
        return testcaseTemplates;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public TestcaseGroup createTestcaseGroupInfo(String spaceCode, Long projectId, TestcaseGroup testcaseGroup, Long userId) {

        if (testcaseGroup.getParentId() != null) {
            TestcaseGroup testcaseGroupExist = testcaseGroupRepository.findByIdAndProjectId(testcaseGroup.getParentId(), projectId).orElseThrow(() -> new ServiceException("testcase.parent.group.notExist"));
            testcaseGroup.setDepth(testcaseGroupExist.getDepth() + 1);
        } else {
            testcaseGroup.setDepth(0L);
        }

        List<TestcaseGroup> sameParentGroups = testcaseGroupRepository.findAllByProjectIdAndParentId(projectId, testcaseGroup.getParentId());
        testcaseGroup.setItemOrder(sameParentGroups.size());
        LocalDateTime now = LocalDateTime.now();
        testcaseGroup.setCreationDate(now);
        testcaseGroup.setLastUpdateDate(now);
        testcaseGroup.setCreatedBy(userId);
        testcaseGroup.setLastUpdatedBy(userId);

        testcaseGroupRepository.save(testcaseGroup);
        return testcaseGroup;
    }


}
