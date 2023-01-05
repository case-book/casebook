package com.mindplates.bugcase.biz.admin.controller;

import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final JsonRedisTemplate jsonRedisTemplate;


    @Operation(description = "시스템 정보 조회")
    @GetMapping("/system/info")
    public Map<String, String> selectSystemInfo() {
        AtomicReference<Properties> keyspace = new AtomicReference<>();
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            keyspace.set(connection.info("keyspace"));
            return null;
        });

        AtomicReference<Properties> memory = new AtomicReference<>();
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            memory.set(connection.info("memory"));
            return null;
        });

        Map<String, String> info = new HashMap<>();

        Properties keyspaceProperties = keyspace.get();
        getInfo(info, keyspaceProperties);

        Properties memoryProperties = memory.get();
        getInfo(info, memoryProperties);

        return info;
    }


    @Operation(description = "레디스 데이터 초기화")
    @DeleteMapping("/system/caches/flush")
    public ResponseEntity<?> flushRedis() {
        jsonRedisTemplate.execute((RedisCallback<Object>) connection -> {
            connection.flushAll();
            return null;
        });

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "레디스 데이터 초기화")
    @DeleteMapping("/system/caches/delete")
    public ResponseEntity<?> deleteRedis() {

        String[] patterns = {"space*", "project*"};

        for (String pattern : patterns) {
            Set<String> keys = jsonRedisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                jsonRedisTemplate.delete(keys);
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void getInfo(Map<String, String> info, Properties memoryProperties) {
        Enumeration<String> memoryEnums = (Enumeration<String>) memoryProperties.propertyNames();
        while (memoryEnums.hasMoreElements()) {
            String key = memoryEnums.nextElement();
            String value = memoryProperties.getProperty(key);
            info.put(key, value);
        }
    }

}
