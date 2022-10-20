package com.mindplates.bugcase;

import com.mindplates.bugcase.framework.config.FileConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties({
        FileConfig.class
})
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class BugCaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(BugCaseApplication.class, args);
    }

}
