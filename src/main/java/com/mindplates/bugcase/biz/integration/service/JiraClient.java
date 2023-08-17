package com.mindplates.bugcase.biz.integration.service;

import com.mindplates.bugcase.biz.integration.dto.JiraAgileBoardDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraAgileDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraAgileSprintDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
import com.mindplates.bugcase.biz.integration.entity.Jira;
import com.mindplates.bugcase.biz.integration.entity.JiraType;
import java.net.URI;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class JiraClient {

    private static final String SERVER_REST_API_PREFIX = "/rest/api/2";
    private static final String AGILE_REST_API_PREFIX = "/rest/agile/1.0";
    private final RestTemplate jiraRestTemplate;

    public JiraClient(@Qualifier("jiraRestTemplate") RestTemplate jiraRestTemplate) {
        this.jiraRestTemplate = jiraRestTemplate;
    }

    public List<JiraProjectDTO> getProjects(Jira jira) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jira.getApiUrl()))
            .path(SERVER_REST_API_PREFIX + "/project")
            .build();

        HttpEntity<List<JiraProjectDTO>> request = new HttpEntity<>(addBearerTokenHeader(jira));

        return jiraRestTemplate
            .exchange(
                uriComponents.toUriString(),
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<List<JiraProjectDTO>>() {
                }
            ).getBody();
    }

    public JiraAgileDTO<List<JiraAgileBoardDTO>> findBoardsByProjectId(Jira jira, String projectIdOrKey, int startAt) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jira.getApiUrl()))
            .path(AGILE_REST_API_PREFIX + "/board")
            .queryParam("projectKeyOrId", projectIdOrKey)
            .queryParam("startAt", startAt)
            .build();

        HttpEntity<List<JiraAgileBoardDTO>> request = new HttpEntity<>(addBearerTokenHeader(jira));

        return jiraRestTemplate
            .exchange(
                uriComponents.toUriString(),
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<JiraAgileDTO<List<JiraAgileBoardDTO>>>() {
                }
            )
            .getBody();
    }

    public JiraProjectDTO findProjectByIdOrKey(Jira jira, String idOrKey) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jira.getApiUrl()))
            .path(SERVER_REST_API_PREFIX + "/project/" + idOrKey)
            .build();

        HttpEntity<JiraProjectDTO> request = new HttpEntity<>(addBearerTokenHeader(jira));

        return jiraRestTemplate
            .exchange(
                uriComponents.toUriString(),
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<JiraProjectDTO>() {
                }
            ).getBody();
    }

    public JiraAgileDTO<List<JiraAgileSprintDTO>> findSprintsByBoardId(Jira jira, String boardId, int startAt) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jira.getApiUrl()))
            .path(AGILE_REST_API_PREFIX + "/board/" + boardId + "/sprint")
            .queryParam("startAt", startAt)
            .build();

        HttpEntity<List<JiraAgileSprintDTO>> request = new HttpEntity<>(addBearerTokenHeader(jira));

        return jiraRestTemplate
            .exchange(
                uriComponents.toUriString(),
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<JiraAgileDTO<List<JiraAgileSprintDTO>>>() {
                }
            )
            .getBody();
    }

    private HttpHeaders addBearerTokenHeader(Jira jira) {
        HttpHeaders httpHeaders = new HttpHeaders();
        if (JiraType.JIRA_CLOUD.equals(jira.getType())) {
            httpHeaders.add("Authorization", "Basic " + jira.getApiToken());
            return httpHeaders;
        } else {
            httpHeaders.add("Authorization", "Bearer " + jira.getApiToken());
        }
        return httpHeaders;
    }

}
