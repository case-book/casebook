package com.mindplates.bugcase.common.bean;

import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import org.springframework.data.redis.core.RedisCallback;

public class InitService {

    private final JsonRedisTemplate<Object> jsonRedisTemplate;

    private final ProjectService projectService;


    public InitService(JsonRedisTemplate<Object> jsonRedisTemplate, ProjectService projectService) {
        this.jsonRedisTemplate = jsonRedisTemplate;
        this.projectService = projectService;
    }

    public void init() {
        // 1.X에서 2.0으로 업그레이드 시 aiEnabled 데이터가 NULL로 입력될 수 있어, 초기화
        projectService.updateProjectAiEnabledFalse();
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            connection.flushAll();
            return null;
        });
    }
}
