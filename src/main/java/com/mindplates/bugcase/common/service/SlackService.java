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

    public void sendText(String url, String message) {
        httpRequestUtil.sendPost(url, SlackMessage.builder().username("CASEBOOK").icon_url(webUrl + "/logo192.png").text(message).build(), String.class);

    }

}
