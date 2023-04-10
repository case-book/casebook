package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import com.mindplates.bugcase.biz.project.repository.ProjectTokenRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectTokenService {

    private final ProjectTokenRepository projectTokenRepository;

    public List<ProjectTokenDTO> selectProjectTokenList(Long projectId) {
        List<ProjectToken> projectTokenList = projectTokenRepository.findAllByProjectId(projectId);
        return projectTokenList.stream().map(ProjectTokenDTO::new).collect(Collectors.toList());
    }

    public ProjectTokenDTO selectProjectTokenInfo(String token) {
        ProjectToken projectToken = projectTokenRepository.findByToken(token).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new ProjectTokenDTO(projectToken);
    }

    public ProjectTokenDTO selectProjectTokenInfo(Long id) {
        ProjectToken projectToken = projectTokenRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new ProjectTokenDTO(projectToken);
    }

    @Transactional
    public ProjectTokenDTO createProjectToken(ProjectTokenDTO projectTokenDTO) {
        ProjectToken projectToken = ProjectToken.builder()
                .project(Project.builder().id(projectTokenDTO.getProject().getId()).build())
                .name(projectTokenDTO.getName())
                .enabled(true)
                .build();

        String token = UUID.randomUUID().toString();
        while (projectTokenRepository.countByToken(token) > 0) {
            token = UUID.randomUUID().toString();
        }

        projectToken.setToken(token);
        projectToken = projectTokenRepository.save(projectToken);
        return new ProjectTokenDTO(projectToken);
    }

    @Transactional
    public ProjectTokenDTO updateProjectTokenLastAccess(Long projectTokenId) {
        ProjectToken projectToken = projectTokenRepository.findById(projectTokenId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectToken.setLastAccess(LocalDateTime.now());
        return new ProjectTokenDTO(projectTokenRepository.save(projectToken));
    }

    @Transactional
    public ProjectTokenDTO updateProjectToken(Long tokenId, ProjectTokenDTO updateProjectToken) {
        ProjectToken projectToken = projectTokenRepository.findById(tokenId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        projectToken.setName(updateProjectToken.getName());
        projectToken.setEnabled(updateProjectToken.isEnabled());
        return new ProjectTokenDTO(projectTokenRepository.save(projectToken));
    }

    @Transactional
    public void deleteProjectToken(Long projectTokenId) {
        projectTokenRepository.deleteById(projectTokenId);
    }


}
