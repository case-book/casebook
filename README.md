# Getting Started

-- server
docker-compose up -d

-- backend application
run com.mindplates.bugcase.BugCaseApplication

-- swagger 
https://localhost:8080/swagger-ui/

-- api test
https://localhost:8080/api/configs/systems/version


-- front dev server start 
cd app
npm install
npm run start

--
https://localhost:3000/


npm config delete "@fortawesome:registry"

-- build


### Reference Documentation

For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.7.3/maven-plugin/reference/html/)
* [Create an OCI image](https://docs.spring.io/spring-boot/docs/2.7.3/maven-plugin/reference/html/#build-image)
* [Validation](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#io.validation)
* [Spring Data JPA](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#data.sql.jpa-and-spring-data)
* [Spring Batch](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#howto.batch)
* [Spring Session](https://docs.spring.io/spring-session/reference/)
* [Spring Data Redis (Access+Driver)](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#data.nosql.redis)
* [Quartz Scheduler](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#io.quartz)
* [Spring Web](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#web)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#using.devtools)
* [WebSocket](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#messaging.websockets)

### Guides

The following guides illustrate how to use some features concretely:

* [Validation](https://spring.io/guides/gs/validating-form-input/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [Accessing data with MySQL](https://spring.io/guides/gs/accessing-data-mysql/)
* [Creating a Batch Service](https://spring.io/guides/gs/batch-processing/)
* [Messaging with Redis](https://spring.io/guides/gs/messaging-redis/)
* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Using WebSocket to build an interactive web application](https://spring.io/guides/gs/messaging-stomp-websocket/)


-Dspring.profiles.active="default,development"


<appender name="Sentry" class="io.sentry.logback.SentryAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>WARN</level>
        </filter>
    </appender>

<root level="error">
            <appender-ref ref="Sentry" />
            <appender-ref ref="CONSOLE"/>
        </root>




CASEBOOK v1.0.1
케이스북 v1.0.1 버전이 릴리즈되었습니다.

<관리자 기능 강화>
- 시스템 관리자의 전체 사용자 및 스페이스 관리 기능 추가
- 프로젝트 권한 강화

<프로젝트 권한 검증 추가>
- 프로젝트 접근 시 프로젝트의 권한에 따른 접근 가능 여부 판단 로직 추가
- 관리자 접근 권한 예외 처리

<최신 릴리즈 알림 기능 추가>
- GIT에 새로운 릴리즈가 등록 알림 기능
