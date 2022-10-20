package com.mindplates.bugcase.framework.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Setter
@Getter
@ConfigurationProperties(prefix = "file")
public class FileConfig {

    private String uploadDir;
    private String allowedExtension;

}
