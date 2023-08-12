package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProjectReleaseService {
    private final MappingUtil mappingUtil;
    private final ProjectReleaseRepository projectReleaseRepository;

    public ProjectReleaseDTO selectRelease(long id) {
        return new ProjectReleaseDTO(projectReleaseRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND)));
    }

    public ProjectReleaseDTO createRelease(ProjectReleaseDTO projectReleaseDTO) {
        return new ProjectReleaseDTO(projectReleaseRepository.save(mappingUtil.convert(projectReleaseDTO, ProjectRelease.class)));
    }
}
