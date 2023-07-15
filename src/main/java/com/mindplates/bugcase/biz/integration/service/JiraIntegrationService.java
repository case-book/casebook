package com.mindplates.bugcase.biz.integration.service;

import com.mindplates.bugcase.biz.integration.dto.JiraIntegrationDTO;
import com.mindplates.bugcase.biz.integration.entity.JiraIntegration;
import com.mindplates.bugcase.biz.integration.repository.JiraIntegrationRepository;
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
public class JiraIntegrationService {

    private final MappingUtil mappingUtil;
    private final SpaceRepository spaceRepository;
    private final JiraIntegrationRepository jiraIntegrationRepository;

    @Transactional
    public JiraIntegrationDTO upsertJiraIntegrationInfo(String spaceCode, JiraIntegrationDTO jiraIntegrationInfo) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        JiraIntegration jiraIntegration = mappingUtil.convert(jiraIntegrationInfo, JiraIntegration.class);
        if (Objects.isNull(jiraIntegration.getId())) {
            jiraIntegration.setSpace(space);
            return new JiraIntegrationDTO(jiraIntegrationRepository.save(jiraIntegration));
        }
        JiraIntegration target = jiraIntegrationRepository.findById(jiraIntegration.getId())
            .orElseThrow(() -> new ServiceException("error.jiraIntegration.notExist"));
        target.update(jiraIntegration);
        return new JiraIntegrationDTO(jiraIntegrationRepository.save(target));
    }

}
