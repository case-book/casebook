package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseTemplateRepository;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class TestcaseService {

    private final TestcaseTemplateRepository testcaseTemplateRepository;


    public List<TestcaseTemplate> selectTestcaseTemplateItemList(Long projectId) {
        return testcaseTemplateRepository.findAllByProjectId(projectId);
    }

    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public List<TestcaseTemplate> saveTestcaseTemplateItemList(String spaceCode, Long projectId, List<TestcaseTemplate> testcaseTemplates, Long userId) {

        LocalDateTime now = LocalDateTime.now();
        testcaseTemplates.stream().forEach((testcaseTemplate -> {
            if (testcaseTemplate.getId() == null) {
                testcaseTemplate.setCreationDate(now);
                testcaseTemplate.setCreatedBy(userId);
            }

            testcaseTemplate.setLastUpdateDate(now);
            testcaseTemplate.setLastUpdatedBy(userId);
        }));


        testcaseTemplateRepository.saveAll(testcaseTemplates);
        return testcaseTemplates;
    }


}
