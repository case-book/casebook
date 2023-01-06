package com.mindplates.bugcase.common.bean;

import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import org.springframework.data.redis.core.RedisCallback;

public class InitService {

    private final JsonRedisTemplate jsonRedisTemplate;

    public InitService (JsonRedisTemplate jsonRedisTemplate) {
        this.jsonRedisTemplate = jsonRedisTemplate;
    }

    public void init() {
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            connection.flushAll();
            return null;
        });
    }
}
