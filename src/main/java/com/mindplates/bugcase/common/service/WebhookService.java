package com.mindplates.bugcase.common.service;


import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.vo.TestrunHookResult;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {

    private final HttpRequestUtil httpRequestUtil;


    public boolean sendText(HttpMethod httpMethod, String url, List<Map<String, String>> headers, List<Map<String, String>> payloads) {
        try {
            TestrunHookResult result = httpRequestUtil.request(url, httpMethod, headers, payloads);
            return result.getCode().equals(HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return false;
        }
    }

    public boolean sendText(HttpMethod httpMethod, String url, List<Map<String, String>> headers, String message) {
        try {
            TestrunHookResult result = httpRequestUtil.request(url, httpMethod, headers, message);
            return result.getCode().equals(HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return false;
        }
    }


}
