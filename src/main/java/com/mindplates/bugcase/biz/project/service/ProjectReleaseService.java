package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ProjectReleaseService {

    private final ProjectReleaseRepository projectReleaseRepository;
    private final TestcaseService testcaseService;

    public ProjectReleaseDTO selectProjectRelease(long releaseId) {
        return projectReleaseRepository
            .findById(releaseId)
            .map(ProjectReleaseDTO::new)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }

    public List<ProjectReleaseDTO> selectProjectReleases(long projectId) {
        return projectReleaseRepository
            .findByProjectIdOrderByCreationDateDesc(projectId)
            .stream()
            .map(ProjectReleaseDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional
    public ProjectReleaseDTO createProjectRelease(String spaceCode, long projectId, ProjectReleaseDTO projectReleaseDTO) {
        try {
            ProjectRelease projectRelease = projectReleaseRepository.save(new ProjectRelease(projectReleaseDTO));
            projectReleaseDTO.getTestcases().forEach(testcaseDTO -> {
                testcaseService.updateProjectRelease(spaceCode, projectId, testcaseDTO.getId(), projectRelease.getId());
            });
            return new ProjectReleaseDTO(projectRelease);
        } catch (DataIntegrityViolationException e) {
            throw new ServiceException(HttpStatus.CONFLICT, "release.name.duplicated");
        }
    }

    @Transactional
    public ProjectReleaseDTO updateProjectRelease(String spaceCode, long projectId, long releaseId, ProjectReleaseDTO projectReleaseDTO) {
        ProjectRelease projectRelease = projectReleaseRepository.save(
            projectReleaseRepository
                .findById(releaseId)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND))
                .update(projectReleaseDTO)
        );
        projectReleaseDTO.getTestcases().forEach(testcaseDTO -> {
            testcaseService.updateProjectRelease(spaceCode, projectId, testcaseDTO.getId(), projectRelease.getId());
        });
        return new ProjectReleaseDTO(projectRelease);
    }

    public void deleteProjectRelease(long releaseId) {
        projectReleaseRepository.deleteById(releaseId);
    }
}
