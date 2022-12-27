package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseItemRepository;
import com.mindplates.bugcase.biz.testcase.service.TestcaseItemFileService;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseItemRepository;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectService {

    private final SpaceRepository spaceRepository;
    private final ProjectRepository projectRepository;

    private final ProjectFileService projectFileService;

    private final TestcaseItemFileService testcaseItemFileService;

    private final TestcaseItemRepository testcaseItemRepository;

    private final TestrunTestcaseGroupTestcaseItemRepository testrunTestcaseGroupTestcaseItemRepository;

    private final MappingUtil mappingUtil;

    @Cacheable(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public ProjectDTO selectProjectInfo(String spaceCode, Long projectId) {
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return mappingUtil.convert(project, ProjectDTO.class);
    }

    public ProjectDTO selectByName(String spaceCode, String name) {
        Project project = projectRepository.findBySpaceCodeAndName(spaceCode, name).orElse(null);
        if (project != null) {
            return mappingUtil.convert(project, ProjectDTO.class);
        }

        return null;
    }

    public boolean existByName(String spaceCode, String name) {
        Long count = projectRepository.countBySpaceCodeAndName(spaceCode, name);
        return count > 0;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#createProjectInfo.id}", value = CacheConfig.PROJECT)
    public ProjectDTO createProjectInfo(String spaceCode, ProjectDTO createProjectInfo, Long userId) {

        Project projectInfo = mappingUtil.convert(createProjectInfo, Project.class);

        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectInfo.setSpace(space);

        AtomicBoolean hasDefault = new AtomicBoolean(false);
        projectInfo.getTestcaseTemplates().forEach((testcaseTemplate -> {

            if (hasDefault.get() && testcaseTemplate.getIsDefault() != null && testcaseTemplate.getIsDefault()) {
                testcaseTemplate.setIsDefault(false);
            }

            if (!hasDefault.get() && testcaseTemplate.getIsDefault() != null && testcaseTemplate.getIsDefault()) {
                hasDefault.set(true);
            }

            testcaseTemplate.setProject(projectInfo);

            testcaseTemplate.getTestcaseTemplateItems().forEach((testcaseTemplateItem -> testcaseTemplateItem.setTestcaseTemplate(testcaseTemplate)));
        }));


        if (!projectInfo.getTestcaseTemplates().isEmpty() && !hasDefault.get()) {
            projectInfo.getTestcaseTemplates().get(0).setIsDefault(true);
        }

        projectInfo.setTestcaseSeq(0);
        projectInfo.setTestcaseGroupSeq(0);

        ProjectUser projectUser = ProjectUser.builder().project(projectInfo).user(User.builder().id(userId).build()).role(UserRoleCode.ADMIN).build();
        projectInfo.setUsers(Arrays.asList(projectUser));

        Project result = projectRepository.save(projectInfo);
        return mappingUtil.convert(result, ProjectDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#updateProjectInfo.id}", value = CacheConfig.PROJECT)
    public ProjectDTO updateProjectInfo(String spaceCode, ProjectDTO updateProjectInfo) {

        List<Long> deleteTestcaseItemIds = new ArrayList<>();
        updateProjectInfo.getTestcaseTemplates().forEach((testcaseTemplate -> {
            testcaseTemplate.getTestcaseTemplateItems().forEach((testcaseTemplateItem -> {
                if (testcaseTemplateItem.isDeleted()) {
                    deleteTestcaseItemIds.add(testcaseTemplateItem.getId());
                }
            }));
        }));

        updateProjectInfo.getTestcaseTemplates().forEach((testcaseTemplate -> {
            testcaseTemplate.getTestcaseTemplateItems().removeIf((TestcaseTemplateItem::isDeleted));
        }));

        Project projectInfo = projectRepository.save(mappingUtil.convert(updateProjectInfo, Project.class));

        deleteTestcaseItemIds.forEach(testcaseItemRepository::deleteByTestcaseTemplateItemId);
        deleteTestcaseItemIds.forEach(testrunTestcaseGroupTestcaseItemRepository::deleteByTestcaseTemplateItemId);

        return mappingUtil.convert(projectInfo, ProjectDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#project.id}", value = CacheConfig.PROJECT)
    public void deleteProjectInfo(String spaceCode, ProjectDTO project) {
        testcaseItemFileService.deleteProjectTestcaseItemFile(project.getId());
        projectFileService.deleteProjectFile(project.getId());
        projectRepository.delete(mappingUtil.convert(project, Project.class));
    }

    public List<ProjectDTO> selectSpaceProjectList(String spaceCode) {
        List<Project> projectList = projectRepository.findAllBySpaceCode(spaceCode);
        return mappingUtil.convert(projectList, ProjectDTO.class);
    }

    public List<ProjectDTO> selectSpaceProjectList(Long spaceId) {
        List<Project> projectList = projectRepository.findAllBySpaceId(spaceId);
        return mappingUtil.convert(projectList, ProjectDTO.class);

    }

    public Long selectSpaceProjectCount(Long spaceId) {
        return projectRepository.countBySpaceId(spaceId);
    }


}
