package com.mindplates.bugcase.framework.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Setter
@Getter
@ConfigurationProperties(prefix = "openai.default")
public class AiConfig {
    private String systemRole;
    private String prompt;
    private String postPrompt;

}
