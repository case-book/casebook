package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseSimpleDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ProjectReleaseService {

    private final ProjectReleaseRepository projectReleaseRepository;
    private final TestcaseProjectReleaseRepository testcaseProjectReleaseRepository;
    private final TestcaseRepository testcaseRepository;

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
    @CacheEvict(value = CacheConfig.PROJECT, key = "{#spaceCode,#projectId}")
    public ProjectReleaseDTO createProjectRelease(String spaceCode, long projectId, ProjectReleaseDTO projectReleaseDTO) {
        List<Testcase> testcases = testcaseRepository.findByIdIn(projectReleaseDTO
            .getTestcases()
            .stream()
            .map(TestcaseSimpleDTO::getId)
            .collect(Collectors.toList())
        );
        try {
            ProjectRelease projectReleaseA = new ProjectRelease(projectReleaseDTO, testcases);
            ProjectRelease projectRelease = projectReleaseRepository.save(projectReleaseA);
            return new ProjectReleaseDTO(projectRelease);
        } catch (DataIntegrityViolationException e) {
            throw new ServiceException(HttpStatus.CONFLICT, "release.name.duplicated");
        }
    }

    @Transactional
    @CacheEvict(value = CacheConfig.PROJECT, key = "{#spaceCode,#projectId}")
    public ProjectReleaseDTO updateProjectRelease(String spaceCode, long projectId, long releaseId, ProjectReleaseDTO projectReleaseDTO) {
        ProjectRelease projectRelease = projectReleaseRepository
            .findById(releaseId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        List<Testcase> testcases = testcaseRepository.findByIdIn(projectReleaseDTO
            .getTestcases()
            .stream()
            .map(TestcaseSimpleDTO::getId)
            .collect(Collectors.toList())
        );

        projectRelease.update(projectReleaseDTO, testcases);
        projectReleaseRepository.save(projectRelease);
        return new ProjectReleaseDTO(projectRelease);
    }

    @Transactional
    @CacheEvict(value = CacheConfig.PROJECT, key = "{#spaceCode,#projectId}")
    public void deleteProjectRelease(String spaceCode, long projectId, long releaseId) {
        testcaseProjectReleaseRepository.deleteByProjectReleaseId(releaseId);
        projectReleaseRepository.deleteById(releaseId);
    }
}
