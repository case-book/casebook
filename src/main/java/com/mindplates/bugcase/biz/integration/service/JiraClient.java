package com.mindplates.bugcase.biz.integration.service;

import com.mindplates.bugcase.biz.integration.dto.JiraAgileBoardDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraAgileDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraAgileSprintDTO;
import com.mindplates.bugcase.biz.integration.dto.JiraProjectDTO;
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

    public List<JiraProjectDTO> getProjects(String jiraApiUrl, String apiToken) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jiraApiUrl))
            .path(SERVER_REST_API_PREFIX + "/project")
            .build();

        HttpEntity<List<JiraProjectDTO>> request = new HttpEntity<>(addBearerTokenHeader(apiToken));

        return jiraRestTemplate
            .exchange(
                uriComponents.toUriString(),
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<List<JiraProjectDTO>>() {
                }
            ).getBody();
    }

    public JiraProjectDTO findProjectByIdOrKey(String jiraApiUrl, String apiToken, String idOrKey) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jiraApiUrl))
            .path(SERVER_REST_API_PREFIX + "/project/" + idOrKey)
            .build();

        HttpEntity<JiraProjectDTO> request = new HttpEntity<>(addBearerTokenHeader(apiToken));

        return jiraRestTemplate
            .exchange(
                uriComponents.toUriString(),
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<JiraProjectDTO>() {
                }
            ).getBody();
    }

    public JiraAgileDTO<List<JiraAgileBoardDTO>> findBoardsByProjectId(String jiraApiUrl, String apiToken, String projectIdOrKey, int startAt) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jiraApiUrl))
            .path(AGILE_REST_API_PREFIX + "/board")
            .queryParam("projectKeyOrId", projectIdOrKey)
            .queryParam("startAt", startAt)
            .build();

        HttpEntity<List<JiraAgileBoardDTO>> request = new HttpEntity<>(addBearerTokenHeader(apiToken));

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

    public JiraAgileDTO<List<JiraAgileSprintDTO>> findSprintsByBoardId(String jiraApiUrl, String apiToken, String boardId, int startAt) {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
            .uri(URI.create(jiraApiUrl))
            .path(AGILE_REST_API_PREFIX + "/board/" + boardId + "/sprint")
            .queryParam("startAt", startAt)
            .build();

        HttpEntity<List<JiraAgileSprintDTO>> request = new HttpEntity<>(addBearerTokenHeader(apiToken));

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

    private HttpHeaders addBearerTokenHeader(String apiToken) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + apiToken);
        return httpHeaders;
    }

}
