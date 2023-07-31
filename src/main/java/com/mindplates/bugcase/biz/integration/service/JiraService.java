package com.mindplates.bugcase.biz.integration.service;

import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import com.mindplates.bugcase.biz.integration.entity.Jira;
import com.mindplates.bugcase.biz.integration.repository.JiraRepository;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import java.util.Objects;
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

    @Transactional
    public JiraDTO upsertJiraIntegrationInfo(String spaceCode, JiraDTO jiraInfo) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        Jira jira = mappingUtil.convert(jiraInfo, Jira.class);
        if (Objects.isNull(jira.getId())) {
            jira.setSpace(space);
            return new JiraDTO(jiraRepository.save(jira));
        }
        Jira target = jiraRepository.findById(jira.getId())
            .orElseThrow(() -> new ServiceException("error.integration.jira.notExist"));
        target.update(jira);
        return new JiraDTO(jiraRepository.save(target));
    }

    public JiraDTO getBySpaceCode(String spaceCode) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new JiraDTO(jiraRepository.findBySpaceId(space.getId()));
    }

}
