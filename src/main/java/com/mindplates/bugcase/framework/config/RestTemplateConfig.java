package com.mindplates.bugcase.framework.config;

import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.nio.charset.StandardCharsets;

@Component
@Log
public class RestTemplateConfig {

    @Value("${proxy.enabled}")
    private boolean proxyEnabled;

    @Value("${proxy.host}")
    private String host;

    @Value("${proxy.port}")
    private Integer port;

    @Bean
    public RestTemplate restTemplate() {

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        if (proxyEnabled) {
            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(host, port));
            factory.setProxy(proxy);
        }

        factory.setConnectTimeout(30 * 1000);
        factory.setReadTimeout(30 * 1000);

        RestTemplate restTemplate = new RestTemplate(factory);
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        return restTemplate;

    }


}
