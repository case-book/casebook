package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectListDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectTokenRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectUserRepository;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {


    private final SpaceService spaceService;
    private final TestcaseService testcaseService;
    private final TestrunService testrunService;
    private final ProjectFileService projectFileService;
    private final ProjectReleaseService projectReleaseService;
    private final ProjectRepository projectRepository;
    private final ProjectUserRepository projectUserRepository;
    private final ProjectTokenRepository projectTokenRepository;

    private final ProjectCachedService projectCachedService;


    public ProjectService(
        @Lazy SpaceService spaceService,
        @Lazy TestrunService testrunService,
        @Lazy TestcaseService testcaseService,
        ProjectRepository projectRepository,
        ProjectFileService projectFileService,
        ProjectUserRepository projectUserRepository,
        ProjectTokenRepository projectTokenRepository,
        ProjectReleaseService projectReleaseService,
        ProjectCachedService projectCachedService
    ) {
        this.spaceService = spaceService;
        this.projectRepository = projectRepository;
        this.projectFileService = projectFileService;
        this.testrunService = testrunService;
        this.testcaseService = testcaseService;
        this.projectTokenRepository = projectTokenRepository;
        this.projectUserRepository = projectUserRepository;
        this.projectReleaseService = projectReleaseService;
        this.projectCachedService = projectCachedService;

    }

    @Transactional
    public ProjectDTO createProjectInfo(String spaceCode, ProjectDTO projectInfo) {

        long userId = SessionUtil.getUserId(true);

        if (existByName(spaceCode, projectInfo.getName())) {
            throw new ServiceException("error.project.duplicated");
        }

        long defaultTemplateCount = projectInfo.getTestcaseTemplates().stream().filter(TestcaseTemplateDTO::isDefaultTemplate).count();
        if (defaultTemplateCount < 1) {
            throw new ServiceException("error.default.template.not.exist");

        } else if (defaultTemplateCount > 1) {
            throw new ServiceException("error.default.template.count.over");
        }

        Long spaceId = spaceService.selectSpaceIdByCode(spaceCode);
        projectInfo.setSpace(SpaceDTO.builder().id(spaceId).build());
        projectInfo.setTestcaseSeq(0);
        projectInfo.setTestcaseGroupSeq(0);

        // 기본 어드민 유저로 사용자 추가
        ProjectUserDTO projectUser = ProjectUserDTO.builder().project(projectInfo).user(UserDTO.builder().id(userId).build()).role(UserRoleCode.ADMIN).build();
        projectInfo.setUsers(Collections.singletonList(projectUser));
        Project project = projectInfo.toEntity();
        return new ProjectDTO(projectRepository.save(project));
    }


    public List<ProjectListDTO> selectSpaceProjectList(long spaceId) {
        List<Project> projectList = projectRepository.findAllBySpaceId(spaceId);
        return projectList.stream().map((ProjectListDTO::new)).collect(Collectors.toList());
    }

    public List<ProjectDTO> selectSpaceProjectDetailList(long spaceId) {
        List<Project> projectList = projectRepository.findAllBySpaceId(spaceId);
        return projectList.stream().map((ProjectDTO::new)).collect(Collectors.toList());
    }

    public List<ProjectListDTO> selectUserSpaceProjectList(String spaceCode, long userId) {
        List<Project> projectList = projectRepository.findAllBySpaceCodeAndUsersUserId(spaceCode, userId);
        return projectList.stream().map((ProjectListDTO::new)).collect(Collectors.toList());
    }

    public String selectProjectName(String spaceCode, long projectId) {
        return projectRepository.findNameBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }

    public Long selectProjectId(String token) {
        ProjectToken projectToken = projectTokenRepository.findByToken(token).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "project.token.invalid"));
        return projectToken.getProject().getId();
    }

    public boolean existByName(String spaceCode, String name) {
        Long count = projectRepository.countBySpaceCodeAndName(spaceCode, name);
        return count > 0;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#updateProjectInfo.id}", value = CacheConfig.PROJECT)
    public ProjectDTO updateProjectInfo(String spaceCode, ProjectDTO updateProjectInfo, Long targetReleaseId) {
        ProjectDTO projectInfo = projectCachedService.selectProjectInfo(spaceCode, updateProjectInfo.getId());
        projectInfo.updateInfo(updateProjectInfo);
        List<Long> deleteTestcaseTemplateIds = projectInfo.updateTestcaseTemplates(updateProjectInfo.getTestcaseTemplates());

        for (Long deleteTestcaseTemplateId : deleteTestcaseTemplateIds) {
            testrunService.deleteTestrunGroupByTestcaseTemplateId(spaceCode, projectInfo.getId(), deleteTestcaseTemplateId);
            testcaseService.deleteTestcaseByTestcaseTemplateId(projectInfo.getId(), deleteTestcaseTemplateId);
        }

        projectInfo.updateUsers(updateProjectInfo.getUsers());
        List<Long> deleteMessageChannelIds = projectInfo.updateMessageChannels(updateProjectInfo.getMessageChannels());
        testrunService.deleteTestrunMessageChannel(spaceCode, projectInfo.getId(), deleteMessageChannelIds);
        if (targetReleaseId != null) {
            projectReleaseService.updateProjectTargetRelease(projectInfo.getId(), targetReleaseId);
        }

        Project updateResult = projectInfo.toEntity();
        return new ProjectDTO(projectRepository.save(updateResult));
    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectInfo(String spaceCode, long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectFileService.deleteProjectFile(project.getId());
        testrunService.deleteProjectTestrun(spaceCode, project.getId());
        projectReleaseService.deleteProjectRelease(spaceCode, project.getId());
        projectTokenRepository.deleteByProjectId(project.getId());
        testcaseService.deleteByProjectId(spaceCode, project.getId());
        projectRepository.delete(project);
    }

    public Long selectSpaceProjectCount(Long spaceId) {
        return projectRepository.countBySpaceId(spaceId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectUser(String spaceCode, long projectId, long userId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        project.getUsers().removeIf((projectUser -> projectUser.getUser().getId().equals(userId)));
        long adminCount = project.getUsers().stream().filter((projectUser -> projectUser.getRole().equals(UserRoleCode.ADMIN))).count();
        if (adminCount < 1L) {
            throw new ServiceException("no.project.admin.exist");
        }

        testrunService.deleteProjectTestrunUser(spaceCode, projectId, userId);

        projectRepository.save(project);
    }

    public boolean selectIsProjectMember(long projectId, long userId) {
        return projectUserRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    public boolean selectIsProjectAdmin(long projectId, long userId) {
        return projectUserRepository.existsByProjectIdAndUserIdAndRole(projectId, userId, UserRoleCode.ADMIN);
    }

    @Transactional
    public void updateProjectAiEnabledFalse() {
        projectRepository.updateProjectAiEnable();
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public int increaseTestcaseGroupSeq(String spaceCode, long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int groupSeq = project.getTestcaseGroupSeq() + 1;
        project.setTestcaseGroupSeq(groupSeq);
        projectRepository.save(project);

        return groupSeq;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public int increaseTestcaseSeq(String spaceCode, long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int testcaseSeq = project.getTestcaseSeq() + 1;
        project.setTestcaseSeq(testcaseSeq);
        projectRepository.save(project);

        return testcaseSeq;
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public int increaseTestrunSeq(String spaceCode, long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        int testrunSeq = project.getTestrunSeq() == null ? 1 : project.getTestrunSeq() + 1;
        project.setTestrunSeq(testrunSeq);
        projectRepository.save(project);

        return testrunSeq;
    }

    @Transactional
    public void deleteProjectUser(long userId) {
        projectUserRepository.deleteByUserId(userId);
    }

}
