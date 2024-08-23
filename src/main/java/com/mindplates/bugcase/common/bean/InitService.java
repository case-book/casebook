package com.mindplates.bugcase.common.bean;

import com.mindplates.bugcase.biz.config.constant.Constants;
import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.config.service.ConfigService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.framework.config.AiConfig;
import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import org.springframework.data.redis.core.RedisCallback;

public class InitService {

    private final JsonRedisTemplate<Object> jsonRedisTemplate;

    private final ProjectService projectService;

    private final ConfigService configService;

    private final AiConfig aiConfig;


    public InitService(JsonRedisTemplate<Object> jsonRedisTemplate, ProjectService projectService, ConfigService configService, AiConfig aiConfig) {
        this.jsonRedisTemplate = jsonRedisTemplate;
        this.projectService = projectService;
        this.configService = configService;
        this.aiConfig = aiConfig;
    }

    public void init() {

        ConfigDTO prefix = configService.selectConfig(Constants.LLM_PREFIX);
        ConfigDTO systemRole = configService.selectConfig(Constants.LLM_SYSTEM_ROLE);
        ConfigDTO prompt = configService.selectConfig(Constants.LLM_PROMPT);

        if (prefix == null) {
            configService.createConfigInfo(Constants.LLM_PREFIX, aiConfig.getLLM_PREFIX());
        }

        if (systemRole == null) {
            configService.createConfigInfo(Constants.LLM_SYSTEM_ROLE, aiConfig.getLLM_SYSTEM_ROLE());
        }

        if (prompt == null) {
            configService.createConfigInfo(Constants.LLM_PROMPT, aiConfig.getLLM_PROMPT());
        }

        // 1.X에서 2.0으로 업그레이드 시 aiEnabled 데이터가 NULL로 입력될 수 있어, 초기화
        projectService.updateProjectAiEnabledFalse();
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            connection.flushAll();
            return null;
        });
    }
}
