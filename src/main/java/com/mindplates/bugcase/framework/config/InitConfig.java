package com.mindplates.bugcase.framework.config;

import com.mindplates.bugcase.biz.config.service.ConfigService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.common.bean.InitService;
import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@RequiredArgsConstructor
public class InitConfig {


    private final JsonRedisTemplate<Object> jsonRedisTemplate;
    private final ProjectService projectService;
    private final ConfigService configService;
    private final AiConfig aiConfig;


    @Bean
    public InitService initService() {
        InitService initService = new InitService(jsonRedisTemplate, projectService, configService, aiConfig);
        initService.init();
        return initService;
    }


}
