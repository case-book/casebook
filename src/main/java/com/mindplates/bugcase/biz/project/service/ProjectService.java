package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseItemRepository;
import com.mindplates.bugcase.biz.testcase.service.TestcaseItemFileService;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseItemRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
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

import java.util.Collections;
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
    public ProjectDTO createProjectInfo(String spaceCode, ProjectDTO projectInfo, Long userId) {

        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        projectInfo.setSpace(SpaceDTO.builder().id(space.getId()).build());

        AtomicBoolean foundDefaultTemplate = new AtomicBoolean(false);
        projectInfo.getTestcaseTemplates().forEach((testcaseTemplate -> {
            if (foundDefaultTemplate.get() && testcaseTemplate.isDefaultTemplate()) {
                testcaseTemplate.setDefaultTemplate(false);
            }

            if (!foundDefaultTemplate.get() && testcaseTemplate.isDefaultTemplate()) {
                foundDefaultTemplate.set(true);
            }
        }));

        if (!projectInfo.getTestcaseTemplates().isEmpty() && !foundDefaultTemplate.get()) {
            projectInfo.getTestcaseTemplates().get(0).setDefaultTemplate(true);
        }

        projectInfo.setTestcaseSeq(0);
        projectInfo.setTestcaseGroupSeq(0);

        // 기본 어드민 유저로 사용자 추가
        ProjectUserDTO projectUser = ProjectUserDTO.builder().project(projectInfo).user(UserDTO.builder().id(userId).build()).role(UserRoleCode.ADMIN).build();
        projectInfo.setUsers(Collections.singletonList(projectUser));

        Project createProjectInfo = mappingUtil.convert(projectInfo, Project.class);
        return mappingUtil.convert(projectRepository.save(createProjectInfo), ProjectDTO.class);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#updateProjectInfo.id}", value = CacheConfig.PROJECT)
    public ProjectDTO updateProjectInfo(String spaceCode, ProjectDTO updateProjectInfo) {
        ProjectDTO projectInfo = this.selectProjectInfo(spaceCode, updateProjectInfo.getId());
        projectInfo.setName(updateProjectInfo.getName());
        projectInfo.setDescription(updateProjectInfo.getDescription());
        projectInfo.setToken(updateProjectInfo.getToken());
        projectInfo.setActivated(updateProjectInfo.isActivated());

        projectInfo.setTestcaseTemplates(updateProjectInfo.getTestcaseTemplates()
                .stream()
                .filter((testcaseTemplate -> !"D".equals(testcaseTemplate.getCrud())))
                .map(testcaseTemplate -> {
                    testcaseTemplate.getTestcaseTemplateItems()
                            .stream()
                            .filter(TestcaseTemplateItemDTO::isDeleted).forEach(testcaseTemplateItem -> {
                                testcaseItemRepository.deleteByTestcaseId(testcaseTemplateItem.getId());
                                testrunTestcaseGroupTestcaseItemRepository.deleteByTestcaseTemplateItemId(testcaseTemplateItem.getId());
                            });

                    testcaseTemplate.setTestcaseTemplateItems(testcaseTemplate.getTestcaseTemplateItems()
                            .stream()
                            .filter(testcaseTemplateItem -> !testcaseTemplateItem.isDeleted()).collect(Collectors.toList()));
                    return testcaseTemplate;
                })
                .collect(Collectors.toList()));

        /*
        updateProjectInfo.getTestcaseTemplates().forEach((testcaseTemplate -> {
            if ("D".equals(testcaseTemplate.getCrud())) {
                projectInfo.getTestcaseTemplates().removeIf((currentTestcaseTemplate -> currentTestcaseTemplate.getId().equals(testcaseTemplate.getId())));
            } else if (testcaseTemplate.getId() == null) {
                TestcaseTemplateDTO currentTestcaseTemplate = mappingUtil.convert(testcaseTemplate, TestcaseTemplateDTO.class);
                projectInfo.getTestcaseTemplates().add(currentTestcaseTemplate);
            } else {
                Optional<TestcaseTemplateDTO> targetTestcaseTemplate = projectInfo.getTestcaseTemplates().stream().filter((currentTestcaseTemplate -> currentTestcaseTemplate.getId().equals(testcaseTemplate.getId()))).findFirst();
                targetTestcaseTemplate.ifPresent(testcaseTemplate::merge);
                testcaseTemplate.getTestcaseTemplateItems().forEach((testcaseTemplateItem -> {
                    if (testcaseTemplateItem.isDeleted()) {
                        if (targetTestcaseTemplate.isPresent()) {
                            targetTestcaseTemplate.get().getTestcaseTemplateItems().removeIf((currentTestcaseTemplateItem -> currentTestcaseTemplateItem.getId().equals(testcaseTemplateItem.getId())));
                            testcaseItemRepository.deleteByTestcaseId(testcaseTemplateItem.getId());
                            testrunTestcaseGroupTestcaseItemRepository.deleteByTestcaseTemplateItemId(testcaseTemplateItem.getId());
                        }
                    } else if (testcaseTemplateItem.getId() == null) {
                        TestcaseTemplateItemDTO currentTestcaseTemplateItem = mappingUtil.convert(testcaseTemplateItem, TestcaseTemplateItemDTO.class);
                        targetTestcaseTemplate.ifPresent(testcaseTemplateDTO -> testcaseTemplateDTO.getTestcaseTemplateItems().add(currentTestcaseTemplateItem));
                    } else {
                        if (targetTestcaseTemplate.isPresent()) {
                            Optional<TestcaseTemplateItemDTO> targetTestcaseTemplateItem = targetTestcaseTemplate.get().getTestcaseTemplateItems().stream().filter((currentTestcaseTemplateItem -> currentTestcaseTemplateItem.getId().equals(testcaseTemplateItem.getId()))).findFirst();
                            if (targetTestcaseTemplateItem.isPresent()) {
                                testcaseTemplateItem.merge(targetTestcaseTemplateItem.get());
                            }
                        }
                    }
                }));
            }
        }));

         */

        AtomicBoolean foundDefaultTemplate = new AtomicBoolean(false);
        projectInfo.getTestcaseTemplates().forEach((testcaseTemplate -> {
            if (foundDefaultTemplate.get() && testcaseTemplate.isDefaultTemplate()) {
                testcaseTemplate.setDefaultTemplate(false);
            }
            if (!foundDefaultTemplate.get() && testcaseTemplate.isDefaultTemplate()) {
                foundDefaultTemplate.set(true);
            }
        }));

        if (!projectInfo.getTestcaseTemplates().isEmpty() && !foundDefaultTemplate.get()) {
            projectInfo.getTestcaseTemplates().get(0).setDefaultTemplate(true);
        }

        projectInfo.setUsers(updateProjectInfo.getUsers().stream().filter(projectUser -> projectUser.getCrud() == null || !projectUser.getCrud().equals("D")).collect(Collectors.toList()));
        Project updateProjectResult = projectRepository.save(mappingUtil.convert(projectInfo, Project.class));

        return mappingUtil.convert(updateProjectResult, ProjectDTO.class);
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
