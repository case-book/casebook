package com.mindplates.bugcase.common.util;

import java.nio.charset.StandardCharsets;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
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

}
