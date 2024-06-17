package com.mindplates.bugcase.framework.config;

import com.mindplates.bugcase.biz.config.service.LlmPromptService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.common.bean.InitService;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.converter.LongToLocalDateTimeConverter;
import com.mindplates.bugcase.framework.converter.StringToLocalDateConverter;
import com.mindplates.bugcase.framework.converter.StringToLocalDateTimeConverter;
import com.mindplates.bugcase.framework.redis.template.JsonRedisTemplate;
import java.io.IOException;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.resource.PathResourceResolver;


@Configuration
public class WebConfig implements WebMvcConfigurer {


    @Value("${spring.profiles.active}")
    private String activeProfile;
    @Value("${bug-case.corsUrls}")
    private String[] corsUrls;

    @Autowired
    private JsonRedisTemplate jsonRedisTemplate;

    @Autowired
    private LlmPromptService llmPromptService;

    @Autowired
    private ProjectService projectService;

    public WebConfig(SessionUtil sessionUtil) {

    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper;
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(this.corsUrls).allowedMethods("GET", "PUT", "POST", "DELETE", "OPTIONS").allowCredentials(true);
    }

    @Bean
    public ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource source = new ReloadableResourceBundleMessageSource();
        source.setBasename("classpath:/messages/message");
        source.setDefaultEncoding("UTF-8");
        source.setCacheSeconds(60);
        source.setUseCodeAsDefaultMessage(true);
        return source;
    }

    @Bean
    public MessageSourceAccessor messageSourceAccessor() {
        return new MessageSourceAccessor(messageSource());
    }


    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new LongToLocalDateTimeConverter());
        registry.addConverter(new StringToLocalDateConverter());
        registry.addConverter(new StringToLocalDateTimeConverter());
    }

    @Bean
    public InitService initService() {
        InitService initService = new InitService(jsonRedisTemplate, llmPromptService, projectService);
        initService.init();
        return initService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**/*")
            .addResourceLocations("classpath:/static/")
            .resourceChain(true)
            .addResolver(new PathResourceResolver() {
                @Override
                protected Resource getResource(String resourcePath, Resource location) throws IOException {
                    Resource requestedResource = location.createRelative(resourcePath);
                    return requestedResource.exists() && requestedResource.isReadable() ? requestedResource : new ClassPathResource("/static/index.html");
                }
            });
    }


}
