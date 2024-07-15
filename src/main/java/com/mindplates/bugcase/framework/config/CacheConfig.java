package com.mindplates.bugcase.framework.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.CacheKeyPrefix;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@AllArgsConstructor
@EnableCaching
public class CacheConfig {

    public static final int DEFAULT_EXPIRE_SEC = 60 * 60;

    public static final String SPACE = "space";
    public static final int SPACE_EXPIRE_SEC = 60 * 60 * 24;


    public static final String SPACE_VARIABLE = "space_variable";
    public static final int SPACE_VARIABLE_EXPIRE_SEC = 60 * 60 * 24;


    public static final String SPACE_PROFILE = "space_profile";
    public static final int SPACE_PROFILE_EXPIRE_SEC = 60 * 60 * 24;


    public static final String SPACE_PROFILE_VARIABLE = "space_profile_variable";
    public static final int SPACE_PROFILE_VARIABLE_EXPIRE_SEC = 60 * 60 * 24;


    public static final String PROJECT = "project";
    public static final int PROJECT_EXPIRE_SEC = 60 * 60 * 24;


    public static final String TESTCASE_GROUPS = "testcase_groups";
    public static final int TESTCASE_GROUPS_EXPIRE_SEC = 60 * 60 * 24 * 7;


    public static final String PROJECT_TESTCASE = "testcase";
    public static final int PROJECT_TESTCASE_EXPIRE_SEC = 60 * 60 * 24 * 7;

    public static final String USER = "user";
    public static final int USER_EXPIRE_SEC = 60 * 60 * 24 * 7;


    private final RedisConnectionFactory connectionFactory;


    @Bean
    public CacheManager cacheManager() {
        RedisCacheConfiguration configuration = RedisCacheConfiguration
            .defaultCacheConfig(Thread.currentThread().getContextClassLoader())
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
            .disableCachingNullValues()
            .entryTtl(Duration.ofSeconds(DEFAULT_EXPIRE_SEC))
            .computePrefixWith(CacheKeyPrefix.simple())
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()));

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        cacheConfigurations.put(SPACE, RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(SPACE_EXPIRE_SEC)));
        cacheConfigurations.put(PROJECT, RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(PROJECT_EXPIRE_SEC)));
        cacheConfigurations.put(SPACE_VARIABLE, RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(SPACE_VARIABLE_EXPIRE_SEC)));
        cacheConfigurations.put(SPACE_PROFILE, RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(SPACE_PROFILE_EXPIRE_SEC)));
        cacheConfigurations.put(SPACE_PROFILE_VARIABLE,
            RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(SPACE_PROFILE_VARIABLE_EXPIRE_SEC)));
        cacheConfigurations.put(TESTCASE_GROUPS, RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(TESTCASE_GROUPS_EXPIRE_SEC)));
        cacheConfigurations.put(PROJECT_TESTCASE, RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(PROJECT_TESTCASE_EXPIRE_SEC)));
        cacheConfigurations.put(USER, RedisCacheConfiguration.defaultCacheConfig(Thread.currentThread().getContextClassLoader()).entryTtl(Duration.ofSeconds(USER_EXPIRE_SEC)));

        return RedisCacheManager.RedisCacheManagerBuilder
            .fromConnectionFactory(connectionFactory)
            .cacheDefaults(configuration)
            .withInitialCacheConfigurations(cacheConfigurations)
            .build();
    }

}
