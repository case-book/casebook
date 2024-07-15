package com.mindplates.bugcase.common.service;


import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final JsonRedisTemplate jsonRedisTemplate;

    public void deleteRedisKeys(String[] patterns) {
        for (String pattern : patterns) {
            Set<String> keys = jsonRedisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                jsonRedisTemplate.delete(keys);
            }
        }
    }

}
