package com.mindplates.bugcase.common.util;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Map;


@Slf4j
@AllArgsConstructor
@Component
public class HttpRequestUtil {
    private final RestTemplate restTemplate;

    public <T> String sendPost(String url, Object obj, Class<T> type) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));

        try {
            restTemplate.postForEntity(url, obj, type);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return null;

    }


    public String sendRequest(String url, MultiValueMap<String, String> param, String[] headerK, String[] headerV, HttpMethod httpMethod, MediaType mediaType) {

        try {
            HttpHeaders headers = new HttpHeaders();
            if (headerK != null) {
                int i = 0;
                for (String each : headerK) {
                    headers.add(each, headerV[i++]);
                }
            }

            headers.setContentType(mediaType == null ? new MediaType("application", "json", StandardCharsets.UTF_8) : mediaType);
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(param, headers);
            return restTemplate.exchange(url, httpMethod, entity, String.class).getBody();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return null;

    }

    public String sendGet(String url, Map<String, String> obj) {
        try {
            return restTemplate.getForObject(url, String.class, obj);
        } catch (Exception e) {
            return null;
        }
    }

}
