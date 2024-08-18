package com.mindplates.bugcase.common.util;

import com.mindplates.bugcase.common.vo.TestrunHookResult;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;


@Slf4j
@AllArgsConstructor
@Component
public class HttpRequestUtil {

    private final RestTemplate restTemplate;

    public <T> String sendPost(String url, Object obj, Class<T> type) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        restTemplate.postForEntity(url, obj, type);
        return null;
    }

    public <T> String get(String url, Map<String, String> headerInfo) {
        HttpHeaders headers = new HttpHeaders();
        headerInfo.forEach(headers::set);
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity<String> request = new HttpEntity<String>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            request,
            String.class
        );

        return response.getBody();
    }

    public TestrunHookResult request(String url, HttpMethod method, List<Map<String, String>> headers, List<Map<String, String>> bodies) {
        try {
            MultiValueMap<String, String> headerData = new LinkedMultiValueMap<>();
            headers.forEach(header -> headerData.add(header.get("key"), header.get("value")));
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            if (bodies != null) {
                bodies.forEach(body -> formData.set(body.get("key"), body.get("value")));
            }
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(formData, headerData);
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                method,
                entity,
                String.class
            );

            return TestrunHookResult.builder().code(response.getStatusCode()).message(response.getBody()).build();
        } catch (HttpServerErrorException e) {
            return TestrunHookResult.builder().code(e.getStatusCode()).message(e.getMessage()).build();
        } catch (Exception e) {
            return TestrunHookResult.builder().code(HttpStatus.INTERNAL_SERVER_ERROR).message(e.getMessage()).build();
        }

    }

    public TestrunHookResult request(String url, HttpMethod method, List<Map<String, String>> headers, String message) {
        try {
            HttpHeaders httpHeaders = new HttpHeaders();
            headers.forEach(header -> httpHeaders.set(header.get("key"), header.get("value")));
            HttpEntity<String> entity = new HttpEntity<String>(message, httpHeaders);
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                method,
                entity,
                String.class
            );

            return TestrunHookResult.builder().code(response.getStatusCode()).message(response.getBody()).build();
        } catch (HttpServerErrorException e) {
            return TestrunHookResult.builder().code(e.getStatusCode()).message(e.getMessage()).build();
        } catch (Exception e) {
            return TestrunHookResult.builder().code(HttpStatus.INTERNAL_SERVER_ERROR).message(e.getMessage()).build();
        }

    }


}
