package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectTokenDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectToken;
import com.mindplates.bugcase.biz.project.repository.ProjectTokenRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ProjectTokenService {

    private final ProjectTokenRepository projectTokenRepository;

    public List<ProjectTokenDTO> selectProjectTokenList(Long projectId) {
        List<ProjectToken> projectTokenList = projectTokenRepository.findAllByProjectId(projectId);
        return projectTokenList.stream().map(ProjectTokenDTO::new).collect(Collectors.toList());
    }

    public ProjectTokenDTO selectProjectTokenInfo(Long id) {
        ProjectToken projectToken = projectTokenRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new ProjectTokenDTO(projectToken);
    }

    @Transactional
    public ProjectTokenDTO createProjectToken(long projectId, ProjectTokenDTO target) {
        ProjectToken targetProjectToken = target.toEntity(projectId);

        String token = UUID.randomUUID().toString();
        while (projectTokenRepository.existsByToken(token)) {
            token = UUID.randomUUID().toString();
        }

        targetProjectToken.setToken(token);
        targetProjectToken.setEnabled(true);
        ProjectToken projectToken = projectTokenRepository.save(targetProjectToken);
        return new ProjectTokenDTO(projectToken);
    }

    @Transactional
    public ProjectTokenDTO updateProjectToken(ProjectTokenDTO target) {
        ProjectToken targetProjectToken = projectTokenRepository.findById(target.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (!target.getProject().getId().equals(targetProjectToken.getProject().getId())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        targetProjectToken.setName(target.getName());
        targetProjectToken.setEnabled(target.isEnabled());
        ProjectToken projectToken = projectTokenRepository.save(targetProjectToken);
        return new ProjectTokenDTO(projectToken);
    }

    @Transactional
    public void deleteProjectToken(Long projectTokenId) {
        projectTokenRepository.deleteById(projectTokenId);
    }


}
