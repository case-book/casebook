package com.mindplates.bugcase.common.service;


import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.vo.SlackMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlackService {
    private final HttpRequestUtil httpRequestUtil;

    @Value("${bug-case.web-url}")
    private String webUrl;

    public boolean sendText(String url, String message) {
        try {
            httpRequestUtil.sendPost(url, SlackMessage.builder().username("CASEBOOK").icon_url(webUrl + "/logo192.png").text(message).build(), String.class);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return false;
        }

        return true;
    }

}
