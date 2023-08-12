package com.mindplates.bugcase.biz.integration.service;

import com.mindplates.bugcase.biz.integration.dto.JiraAgileBoardDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraAgileDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraAgileSprintDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
import com.mindplates.bugcase.biz.integration.entity.Jira;
import com.mindplates.bugcase.biz.integration.entity.JiraProject;
import com.mindplates.bugcase.biz.integration.repository.JiraProjectRepository;
import com.mindplates.bugcase.biz.integration.repository.JiraRepository;
import com.mindplates.bugcase.biz.integration.repository.JiraSprintRepository;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.repository.ProjectRepository;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JiraService {

    private final MappingUtil mappingUtil;
    private final SpaceRepository spaceRepository;
    private final JiraRepository jiraRepository;
    private final JiraClient jiraClient;
    private final ProjectRepository projectRepository;
    private final JiraProjectRepository jiraProjectRepository;
    private final JiraSprintRepository jiraSprintRepository;

    @Transactional
    public JiraDTO upsertJiraIntegrationInfo(String spaceCode, JiraDTO jiraInfo) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Jira jira = mappingUtil.convert(jiraInfo, Jira.class);
        if (Objects.isNull(jira.getId())) {
            jira.setSpace(space);
            return new JiraDTO(jiraRepository.save(jira));
        }
        Jira target = jiraRepository.findById(jira.getId()).orElseThrow(() -> new ServiceException("error.integration.jira.notExist"));
        target.update(jira);
        return new JiraDTO(jiraRepository.save(target));
    }

    public JiraDTO getBySpaceCode(String spaceCode) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new JiraDTO(jiraRepository.findBySpaceId(space.getId()).orElse(null));
    }

    public List<JiraProjectDTO> getJiraProjectsBySpaceCode(String spaceCode) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Jira jira = jiraRepository.findBySpaceId(space.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return jiraClient.getProjects(jira.getApiUrl(), jira.getApiToken());
    }

    @Transactional
    public JiraProjectDTO upsertJiraProjectIntegrationInfo(String spaceCode, long projectId, JiraProjectDTO jiraProjectInfo) {
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Optional<JiraProject> targetOptional = jiraProjectRepository.findByProjectId(project.getId());
        if (targetOptional.isPresent()) {
            JiraProject target = targetOptional.get();
            target.update(mappingUtil.convert(jiraProjectInfo, JiraProject.class));
            return new JiraProjectDTO(jiraProjectRepository.save(target));
        }
        JiraProject jiraProject = mappingUtil.convert(jiraProjectInfo, JiraProject.class);
        jiraProject.setProject(project);
        return new JiraProjectDTO(jiraProjectRepository.save(jiraProject));
    }

    public JiraProjectDTO getJiraProjectBySpaceCodeAndProjectIdAndJiraProjectKey(String spaceCode, long projectId, String jiraProjectKey) {
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Jira jira = jiraRepository.findBySpaceId(project.getSpace().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return jiraClient.findProjectByIdOrKey(jira.getApiUrl(), jira.getApiToken(), jiraProjectKey);
    }

    public JiraProjectDTO getJiraProjectIntegrationBySpaceCodeAndProjectId(String spaceCode, long projectId) {
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return jiraProjectRepository.findByProjectId(project.getId()).map(JiraProjectDTO::new).orElse(null);
    }

    public JiraAgileDTO<List<JiraAgileBoardDTO>> getJiraBoardsByProjectId(String spaceCode, long projectId, int startAt) {
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Jira jira = jiraRepository.findBySpaceId(project.getSpace().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        JiraProject jiraProject = jiraProjectRepository.findByProjectId(project.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return jiraClient.findBoardsByProjectId(jira.getApiUrl(), jira.getApiToken(), jiraProject.getJiraProjectKey(), startAt);
    }

    public JiraAgileDTO<List<JiraAgileSprintDTO>> getJiraSprintsByProjectId(String spaceCode, long projectId, String boardId, int startAt) {
        Project project = projectRepository.findBySpaceCodeAndId(spaceCode, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Jira jira = jiraRepository.findBySpaceId(project.getSpace().getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return jiraClient.findSprintsByBoardId(jira.getApiUrl(), jira.getApiToken(), boardId, startAt);
    }

    @Transactional
    public void deleteBySpaceId(long spaceId) {
        jiraSprintRepository.deleteBySpaceId(spaceId);
        jiraProjectRepository.deleteBySpaceId(spaceId);
        jiraRepository.deleteBySpaceId(spaceId);
    }

    @Transactional
    public void deleteByProjectId(long projectId) {
        jiraSprintRepository.deleteByProjectId(projectId);
        jiraProjectRepository.deleteByProjectId(projectId);
    }

}
