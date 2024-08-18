package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProjectCachedService {

    private final ProjectRepository projectRepository;

    @Cacheable(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public ProjectDTO selectProjectInfo(String spaceCode, long projectId) {
        Long id = projectRepository.findIdBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if (id == null) {
            throw new ServiceException(HttpStatus.NOT_FOUND);
        }

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new ProjectDTO(project);
    }


}
