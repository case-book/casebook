package com.mindplates.bugcase.framework.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Setter
@Getter
@ConfigurationProperties(prefix = "openai.default")
public class AiConfig {

    private String LLM_SYSTEM_ROLE;
    private String LLM_PROMPT;
    private String LLM_PREFIX;
    private String LLM_POSTFIX;

}
