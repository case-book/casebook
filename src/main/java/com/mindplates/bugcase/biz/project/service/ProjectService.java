package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ProjectService {

  private final ProjectRepository projectRepository;

  @Cacheable(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
  public Optional<Project> selectProjectInfo(String spaceCode, Long projectId) {
    return projectRepository.findBySpaceCodeAndId(spaceCode, projectId);
  }

  public Project selectByName(String spaceCode, String name) {
    return projectRepository.findBySpaceCodeAndName(spaceCode, name).orElse(null);
  }

  @Transactional
  @CacheEvict(key = "{#spaceCode,#project.id}", value = CacheConfig.PROJECT)
  public Project createProjectInfo(String spaceCode, Project project) {
    project.setTestcaseSeq(0);
    project.setTestcaseGroupSeq(0);
    projectRepository.save(project);
    return project;
  }

  @Transactional
  @CacheEvict(key = "{#spaceCode,#project.id}", value = CacheConfig.PROJECT)
  public Project updateProjectInfo(String spaceCode, Project project) {
    projectRepository.save(project);
    return project;
  }

  @Transactional
  @CacheEvict(key = "{#spaceCode,#project.id}", value = CacheConfig.PROJECT)
  public void deleteProjectInfo(String spaceCode, Project project) {
    projectRepository.delete(project);
  }

  public List<Project> selectSpaceProjectList(String spaceCode) {
    return projectRepository.findAllBySpaceCode(spaceCode);
  }

  public List<Project> selectSpaceProjectList(Long spaceId) {
    return projectRepository.findAllBySpaceId(spaceId);
  }

  public Long selectSpaceProjectCount(Long spaceId) {
    return projectRepository.countBySpaceId(spaceId);
  }


}
