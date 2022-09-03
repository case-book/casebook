package com.mindplates.bugcase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class BugCaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(BugCaseApplication.class, args);
    }

}
