package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectListDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import com.mindplates.bugcase.biz.project.repository.ProjectReleaseRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectTokenRepository;
import com.mindplates.bugcase.biz.project.repository.ProjectUserRepository;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseGroupRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseItemRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseProjectReleaseRepository;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseRepository;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.repository.TestrunMessageChannelRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseCommentRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseRepository;
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
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final SpaceRepository spaceRepository;
    private final ProjectRepository projectRepository;
    private final ProjectFileService projectFileService;

    private final TestcaseService testcaseService;

    private final TestrunService testrunService;

    private final TestcaseGroupRepository testcaseGroupRepository;
    private final TestcaseRepository testcaseRepository;
    private final TestcaseItemRepository testcaseItemRepository;
    private final ProjectUserRepository projectUserRepository;
    private final ProjectTokenRepository projectTokenRepository;
    private final ProjectReleaseService projectReleaseService;
    private final TestcaseProjectReleaseRepository testcaseProjectReleaseRepository;
    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;
    private final TestrunTestcaseGroupTestcaseCommentRepository testrunTestcaseGroupTestcaseCommentRepository;
    private final TestrunMessageChannelRepository testrunMessageChannelRepository;
    private final ProjectReleaseRepository projectReleaseRepository;


    public ProjectService(SpaceRepository spaceRepository, ProjectRepository projectRepository, ProjectFileService projectFileService,
        @Lazy TestrunService testrunService, TestcaseService testcaseService, TestcaseItemRepository testcaseItemRepository,
        ProjectUserRepository projectUserRepository,
        ProjectTokenRepository projectTokenRepository,
        ProjectReleaseService projectReleaseService, TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository,
        TestrunMessageChannelRepository testrunMessageChannelRepository, TestcaseRepository testcaseRepository,
        TestcaseProjectReleaseRepository testcaseProjectReleaseRepository,
        TestrunTestcaseGroupTestcaseCommentRepository testrunTestcaseGroupTestcaseCommentRepository,
        TestcaseGroupRepository testcaseGroupRepository,

        ProjectReleaseRepository projectReleaseRepository) {
        this.spaceRepository = spaceRepository;
        this.projectRepository = projectRepository;
        this.projectFileService = projectFileService;
        this.testrunService = testrunService;
        this.testcaseService = testcaseService;
        this.testcaseItemRepository = testcaseItemRepository;
        this.projectTokenRepository = projectTokenRepository;
        this.projectUserRepository = projectUserRepository;
        this.projectReleaseService = projectReleaseService;
        this.testrunTestcaseGroupTestcaseRepository = testrunTestcaseGroupTestcaseRepository;
        this.testrunMessageChannelRepository = testrunMessageChannelRepository;
        this.testcaseRepository = testcaseRepository;
        this.testcaseProjectReleaseRepository = testcaseProjectReleaseRepository;
        this.testrunTestcaseGroupTestcaseCommentRepository = testrunTestcaseGroupTestcaseCommentRepository;
        this.testcaseGroupRepository = testcaseGroupRepository;
        this.projectReleaseRepository = projectReleaseRepository;

    }

    @Transactional
    public ProjectDTO createProjectInfo(String spaceCode, ProjectDTO projectInfo) {

        long userId = SessionUtil.getUserId(true);

        if (existByName(spaceCode, projectInfo.getName())) {
            throw new ServiceException("error.project.duplicated");
        }

        // projectInfo.getTestcaseTemplates()에서 default가 2개 이상이면 Exception
        long defaultTemplateCount = projectInfo.getTestcaseTemplates().stream().filter(TestcaseTemplateDTO::isDefaultTemplate).count();
        if (defaultTemplateCount < 1) {
            throw new ServiceException("error.default.template.not.exist");

        } else if (defaultTemplateCount > 1) {
            throw new ServiceException("error.default.template.count.over");
        }

        Long spaceId = spaceRepository.findIdByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectInfo.setSpace(SpaceDTO.builder().id(spaceId).build());
        projectInfo.setTestcaseSeq(0);
        projectInfo.setTestcaseGroupSeq(0);

        // 기본 어드민 유저로 사용자 추가
        ProjectUserDTO projectUser = ProjectUserDTO.builder().project(projectInfo).user(UserDTO.builder().id(userId).build()).role(UserRoleCode.ADMIN).build();
        projectInfo.setUsers(Collections.singletonList(projectUser));
        Project project = projectInfo.toEntity();
        return new ProjectDTO(projectRepository.save(project));
    }

    @Cacheable(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public ProjectDTO selectProjectInfo(String spaceCode, Long projectId) {
        Long id = projectRepository.findIdBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if (id == null) {
            throw new ServiceException(HttpStatus.NOT_FOUND);
        }

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new ProjectDTO(project);
    }

    public List<ProjectListDTO> selectSpaceProjectList(Long spaceId) {
        List<Project> projectList = projectRepository.findAllBySpaceId(spaceId);
        return projectList.stream().map((ProjectListDTO::new)).collect(Collectors.toList());
    }

    public List<ProjectDTO> selectSpaceProjectDetailList(Long spaceId) {
        List<Project> projectList = projectRepository.findAllBySpaceId(spaceId);
        return projectList.stream().map((ProjectDTO::new)).collect(Collectors.toList());
    }

    public List<ProjectListDTO> selectUserSpaceProjectList(String spaceCode, Long userId) {
        List<Project> projectList = projectRepository.findAllBySpaceCodeAndUsersUserId(spaceCode, userId);
        return projectList.stream().map((ProjectListDTO::new)).collect(Collectors.toList());
    }

    public String selectProjectName(String spaceCode, Long projectId) {
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
        ProjectDTO projectInfo = selectProjectInfo(spaceCode, updateProjectInfo.getId());
        projectInfo.updateInfo(updateProjectInfo);
        List<Long> deleteTestcaseTemplateIds = projectInfo.updateTestcaseTemplates(updateProjectInfo.getTestcaseTemplates());

        for (Long deleteTestcaseTemplateId : deleteTestcaseTemplateIds) {
            testrunTestcaseGroupTestcaseCommentRepository.deleteByTestcaseTemplateId(deleteTestcaseTemplateId);
            testrunTestcaseGroupTestcaseRepository.deleteByTestcaseTemplateId(deleteTestcaseTemplateId);
            testcaseProjectReleaseRepository.deleteByTestcaseTemplateId(deleteTestcaseTemplateId);
            testcaseItemRepository.deleteByTestcaseTemplateId(deleteTestcaseTemplateId);
            testcaseRepository.deleteByTestcaseTemplateId(deleteTestcaseTemplateId);
        }

        projectInfo.updateUsers(updateProjectInfo.getUsers());
        List<Long> deleteMessageChannelIds = projectInfo.updateMessageChannels(updateProjectInfo.getMessageChannels());
        deleteMessageChannelIds.forEach((testrunMessageChannelRepository::deleteByProjectMessageChannelId));
        if (targetReleaseId != null) {
            projectReleaseService.updateProjectTargetRelease(projectInfo.getId(), targetReleaseId);
        }

        Project updateResult = projectInfo.toEntity();
        return new ProjectDTO(projectRepository.save(updateResult));
    }


    @Transactional
    @CacheEvict(key = "{#spaceCode,#project.id}", value = CacheConfig.PROJECT)
    public void deleteProjectInfo(String spaceCode, long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectFileService.deleteProjectFile(project.getId());
        testrunService.deleteProjectTestrun(spaceCode, project.getId());
        testcaseProjectReleaseRepository.deleteByProjectId(project.getId());
        projectReleaseRepository.deleteByProjectId(project.getId());
        projectTokenRepository.deleteByProjectId(project.getId());
        testcaseService.deleteByProjectId(project.getId());
        projectRepository.delete(project);
    }

    public Long selectSpaceProjectCount(Long spaceId) {
        return projectRepository.countBySpaceId(spaceId);
    }

    @Transactional
    @CacheEvict(key = "{#spaceCode,#projectId}", value = CacheConfig.PROJECT)
    public void deleteProjectUser(String spaceCode, Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        project.getUsers().removeIf((projectUser -> projectUser.getUser().getId().equals(userId)));
        long adminCount = project.getUsers().stream().filter((projectUser -> projectUser.getRole().equals(UserRoleCode.ADMIN))).count();
        if (adminCount < 1L) {
            throw new ServiceException("no.project.admin.exist");
        }

        testrunService.deleteProjectTestrunUser(spaceCode, projectId, userId);

        projectRepository.save(project);
    }

    public boolean selectIsProjectMember(Long projectId, Long userId) {
        return projectUserRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    public boolean selectIsProjectAdmin(Long projectId, Long userId) {
        return projectUserRepository.existsByProjectIdAndUserIdAndRole(projectId, userId, UserRoleCode.ADMIN);
    }

    @Transactional
    public void updateProjectAiEnabledFalse() {
        projectRepository.updateProjectAiEnable();
    }

}
