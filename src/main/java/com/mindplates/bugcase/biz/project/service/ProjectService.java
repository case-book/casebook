package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.testcase.service.TestcaseItemFileService;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.UserRole;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final TestcaseItemFileService testcaseItemFileService;

    @Cacheable(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public Optional<Project> selectProjectInfo(String spaceCode, Long projectId) {
        return projectRepository.findBySpaceCodeAndId(spaceCode, projectId);
    }

    public Project selectByName(String spaceCode, String name) {
        return projectRepository.findBySpaceCodeAndName(spaceCode, name).orElse(null);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#project.id}", value = CacheConfig.PROJECT)
    public Project createProjectInfo(String spaceCode, Project project, Long userId) {
        project.setTestcaseSeq(0);
        project.setTestcaseGroupSeq(0);
        ProjectUser projectUser = ProjectUser.builder().project(project).user(User.builder().id(userId).build()).role(UserRole.ADMIN).build();
        project.setUsers(Arrays.asList(projectUser));
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
        testcaseItemFileService.deleteProjectTestcaseItemFile(project.getId());
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
