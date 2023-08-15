package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProjectReleaseService {

    private final MappingUtil mappingUtil;
    private final ProjectReleaseRepository projectReleaseRepository;

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

    public ProjectReleaseDTO createProjectRelease(ProjectReleaseDTO projectReleaseDTO) {
        return new ProjectReleaseDTO(projectReleaseRepository.save(mappingUtil.convert(projectReleaseDTO, ProjectRelease.class)));
    }

    public ProjectReleaseDTO updateProjectRelease(long releaseId, ProjectReleaseDTO projectReleaseDTO) {
        ProjectRelease projectRelease = projectReleaseRepository.findById(releaseId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectRelease.setName(projectReleaseDTO.getName());
        projectRelease.setDescription(projectReleaseDTO.getDescription());
        projectRelease.setTestcases(projectReleaseDTO
            .getTestcases()
            .stream()
            .map(testcaseDTO -> mappingUtil.convert(testcaseDTO, Testcase.class))
            .collect(Collectors.toList())
        );
        return new ProjectReleaseDTO(projectReleaseRepository.save(projectRelease));
    }

    public void deleteProjectRelease(long releaseId) {
        projectReleaseRepository.deleteById(releaseId);
    }
}
