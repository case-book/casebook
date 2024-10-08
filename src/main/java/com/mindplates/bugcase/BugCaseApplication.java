package com.mindplates.bugcase;

import com.mindplates.bugcase.framework.config.AiConfig;
import com.mindplates.bugcase.framework.config.FileConfig;
import jakarta.annotation.PostConstruct;
import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.ApplicationPidFileWriter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableConfigurationProperties({
    FileConfig.class,
    AiConfig.class
})
// @SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class BugCaseApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BugCaseApplication.class);
        app.addListeners(new ApplicationPidFileWriter());
        app.run(args);
    }

    @PostConstruct
    public void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

}
