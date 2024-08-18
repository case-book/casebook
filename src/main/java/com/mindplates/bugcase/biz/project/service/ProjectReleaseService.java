package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseListDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ProjectReleaseService {

    private final ProjectReleaseRepository projectReleaseRepository;
    private final TestcaseProjectReleaseRepository testcaseProjectReleaseRepository;
    private final TestcaseRepository testcaseRepository;
    private final CacheManager cacheManager;

    public ProjectReleaseDTO selectProjectRelease(long releaseId) {
        return projectReleaseRepository
            .findById(releaseId)
            .map(ProjectReleaseDTO::new)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }

    public List<ProjectReleaseDTO> selectProjectReleases(String spaceCode, long projectId) {
        return projectReleaseRepository
            .findByProjectIdOrderByNameDesc(projectId)
            .stream()
            .map(ProjectReleaseDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional

    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
    })
    public ProjectReleaseDTO createProjectRelease(String spaceCode, long projectId, ProjectReleaseDTO projectReleaseDTO) {
        List<Testcase> testcases = testcaseRepository.findByIdIn(projectReleaseDTO
            .getTestcases()
            .stream()
            .map(TestcaseListDTO::getId)
            .collect(Collectors.toList())
        );

        Long count = projectReleaseRepository.countByProjectIdAndName(projectId, projectReleaseDTO.getName());

        if (count > 0) {
            throw new ServiceException(HttpStatus.CONFLICT, "release.name.duplicated");
        }

        if (projectReleaseDTO.getIsTarget() != null && projectReleaseDTO.getIsTarget()) {
            List<ProjectRelease> targetReleaseList = projectReleaseRepository.findByProjectIdAndIsTargetTrue(projectId);
            if (targetReleaseList.size() > 0) {
                for (ProjectRelease projectRelease : targetReleaseList) {
                    projectRelease.setIsTarget(false);
                    projectReleaseRepository.save(projectRelease);
                }
            }
        }

        Cache projectTestcaseCache = cacheManager.getCache(CacheConfig.PROJECT_TESTCASE);
        if (projectTestcaseCache != null) {
            testcases.forEach(testcase -> projectTestcaseCache.evictIfPresent(spaceCode + "," + testcase.getId()));
        }

        return new ProjectReleaseDTO(projectReleaseRepository.save(new ProjectRelease(projectReleaseDTO, testcases)));
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
    })
    public ProjectReleaseDTO updateProjectRelease(String spaceCode, long projectId, long releaseId, ProjectReleaseDTO projectReleaseDTO) {
        ProjectRelease projectRelease = projectReleaseRepository
            .findById(releaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        List<Long> testcaseIds = projectReleaseDTO
            .getTestcases()
            .stream()
            .map(TestcaseListDTO::getId)
            .collect(Collectors.toList());

        List<Testcase> testcases = testcaseRepository.findByIdIn(testcaseIds);

        Long count = projectReleaseRepository.countByProjectIdAndNameAndIdIsNot(projectId, projectReleaseDTO.getName(), releaseId);

        if (count > 0) {
            throw new ServiceException(HttpStatus.CONFLICT, "release.name.duplicated");
        }

        if (projectReleaseDTO.getIsTarget() != null && projectReleaseDTO.getIsTarget()) {
            List<ProjectRelease> targetReleaseList = projectReleaseRepository.findByProjectIdAndIsTargetTrue(projectId);
            if (!targetReleaseList.isEmpty()) {
                for (ProjectRelease targetRelease : targetReleaseList) {
                    targetRelease.setIsTarget(false);
                    projectReleaseRepository.save(targetRelease);
                }
            }
        }

        projectRelease.setName(projectReleaseDTO.getName());
        projectRelease.setDescription(projectReleaseDTO.getDescription());
        projectRelease.setIsTarget(projectReleaseDTO.getIsTarget());

        Cache projectTestcaseCache = cacheManager.getCache(CacheConfig.PROJECT_TESTCASE);

        // 선택에서 제외된 테스트케이스 릴리스 삭제
        projectRelease.getTestcaseProjectReleases().forEach(testcaseProjectRelease -> {

            if (!testcaseIds.contains(testcaseProjectRelease.getTestcase().getId())) {
                testcaseProjectReleaseRepository.deleteByProjectReleaseIdAndTestcaseId(testcaseProjectRelease.getProjectRelease().getId(), testcaseProjectRelease.getTestcase().getId());
            }

            if (projectTestcaseCache != null) {
                projectTestcaseCache.evictIfPresent(spaceCode + "," + testcaseProjectRelease.getTestcase().getId());
            }
        });
        projectRelease.getTestcaseProjectReleases().removeIf(testcaseProjectRelease -> !testcaseIds.contains(testcaseProjectRelease.getTestcase().getId()));

        if (projectTestcaseCache != null) {
            testcases.forEach(testcase -> projectTestcaseCache.evictIfPresent(spaceCode + "," + testcase.getId()));
        }

        for (Testcase testcase : testcases) {
            if (projectRelease.getTestcaseProjectReleases()
                .stream()
                .noneMatch(testcaseProjectRelease ->
                    testcaseProjectRelease.getProjectRelease().getId().equals(testcaseProjectRelease.getProjectRelease().getId())
                        && testcaseProjectRelease.getTestcase().getId().equals(testcase.getId()))) {
                projectRelease.getTestcaseProjectReleases().add(TestcaseProjectRelease.builder()
                    .projectRelease(projectRelease)
                    .testcase(testcase)
                    .build());
            }

        }

        projectReleaseRepository.save(projectRelease);
        return new ProjectReleaseDTO(projectRelease);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
    })
    public void deleteProjectRelease(String spaceCode, long projectId, long releaseId) {
        testcaseProjectReleaseRepository.deleteByProjectReleaseId(releaseId);
        projectReleaseRepository.deleteById(releaseId);
    }


    @Transactional
    public void updateProjectTargetRelease(Long projectId, Long targetReleaseId) {
        List<ProjectRelease> targetReleaseList = projectReleaseRepository.findByProjectIdAndIsTargetTrue(projectId);
        if (!targetReleaseList.isEmpty()) {
            for (ProjectRelease projectRelease : targetReleaseList) {
                if (!projectRelease.getId().equals(targetReleaseId)) {
                    projectRelease.setIsTarget(false);
                    projectReleaseRepository.save(projectRelease);
                }
            }
        }

        ProjectRelease targetRelease = projectReleaseRepository.findByIdAndProjectId(targetReleaseId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if (!targetRelease.getIsTarget()) {
            targetRelease.setIsTarget(true);
            projectReleaseRepository.save(targetRelease);
        }

    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT),
        @CacheEvict(key = "{#projectId}", value = CacheConfig.TESTCASE_GROUPS),
    })
    public void deleteProjectRelease(String spaceCode, long projectId) {
        List<Long> testcaseIds = testcaseRepository.selectTestcaseIdsByProjectId(projectId);
        Cache projectTestcaseCache = cacheManager.getCache(CacheConfig.PROJECT_TESTCASE);
        if (projectTestcaseCache != null) {
            testcaseIds.forEach(testcaseId -> projectTestcaseCache.evictIfPresent(spaceCode + "," + testcaseId));
        }
        testcaseProjectReleaseRepository.deleteByProjectId(projectId);
        projectReleaseRepository.deleteByProjectId(projectId);
    }


}
