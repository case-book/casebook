package com.mindplates.bugcase;

import com.mindplates.bugcase.framework.config.FileConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.ApplicationPidFileWriter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@EnableConfigurationProperties({
        FileConfig.class
})
// @SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@SpringBootApplication
@EnableJpaAuditing
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
