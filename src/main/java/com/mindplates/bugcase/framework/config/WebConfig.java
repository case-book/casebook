package com.mindplates.bugcase.framework.config;

import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.framework.interceptor.LoginCheckInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {


    @Value("${spring.profiles.active}")
    private String activeProfile;
    @Value("${bug-case.corsUrls}")
    private String[] corsUrls;

    private final SessionUtil sessionUtil;
    private final UserService userService;

    public WebConfig(SessionUtil sessionUtil, UserService userService) {
        this.sessionUtil = sessionUtil;
        this.userService = userService;
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(this.corsUrls)
                .allowedMethods("GET", "PUT", "POST", "DELETE", "OPTIONS").allowCredentials(true);
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


    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setSameSite("None");
        serializer.setUseSecureCookie(true);
        return serializer;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());

        registry.addInterceptor(
                        new LoginCheckInterceptor(this.userService, this.sessionUtil))
                .addPathPatterns("/**")
                .excludePathPatterns("/")
                .excludePathPatterns("/static/**")
                .excludePathPatterns("/*.ico")
                .excludePathPatterns("/*.png")
                .excludePathPatterns("/*.html")
                .excludePathPatterns("/*.json")
                .excludePathPatterns("/*.txt")
                .excludePathPatterns("/test/**/")
                .excludePathPatterns("/api/common/**")
                .excludePathPatterns("/v3/**")
                .excludePathPatterns("/v2/**")
                .excludePathPatterns("/webjars/**")
                .excludePathPatterns("/swagger-ui/**")
                .excludePathPatterns("/swagger**")
                .excludePathPatterns("/swagger-resources/**")
                .excludePathPatterns("/error");
    }


}
