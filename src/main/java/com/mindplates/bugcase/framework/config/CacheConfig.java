package com.mindplates.bugcase.framework.config;

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

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@AllArgsConstructor
@EnableCaching
public class CacheConfig {

    public static final int DEFAULT_EXPIRE_SEC = 60 * 60;
    public static final String SPACE = "space";
    public static final int SPACE_EXPIRE_SEC = 60 * 60 * 24;

    public static final String PROJECT = "project";

    public static final int PROJECT_EXPIRE_SEC = 60 * 60 * 24;
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

        return RedisCacheManager.RedisCacheManagerBuilder
                .fromConnectionFactory(connectionFactory)
                .cacheDefaults(configuration)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }

}
