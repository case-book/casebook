package com.mindplates.bugcase.framework.config;

import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.framework.handler.ExceptionHandlerFilter;
import com.mindplates.bugcase.framework.security.CustomAccessDeniedHandler;
import com.mindplates.bugcase.framework.security.CustomAuthenticationEntryPoint;
import com.mindplates.bugcase.framework.security.JwtAuthenticationFilter;
import com.mindplates.bugcase.framework.security.JwtTokenProvider;
import com.mindplates.bugcase.framework.security.MethodFinder;
import com.mindplates.bugcase.framework.security.UserTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserTokenProvider userTokenProvider;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final SpaceService spaceService;
    private final MessageSourceAccessor messageSourceAccessor;
    private final ProjectService projectService;
    private final MethodFinder methodFinder;

    @Value("${bug-case.corsUrls}")
    private String[] corsUrls;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .sessionManagement((httpSecuritySessionManagementConfigurer -> {
                httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            }))
            .authorizeHttpRequests(authorizeRequests -> {
                authorizeRequests
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/configs/systems/**").permitAll()
                    .requestMatchers("/api/users/login", "/api/users/logout", "/api/users/join", "/api/users/refresh").permitAll()
                    .requestMatchers("/api/**/projects/**/testcases/**/images/**").permitAll()
                    .requestMatchers("/api/**/projects/**/testruns/**/images/**").permitAll()
                    .requestMatchers("/api/**/projects/**/images/**").permitAll()
                    .requestMatchers("/api/links/**").permitAll()
                    .requestMatchers("/ws/**").permitAll()
                    .requestMatchers("/api/**").authenticated()
                    .anyRequest().permitAll();
            })
            .exceptionHandling(authenticationManager -> {
                authenticationManager.authenticationEntryPoint(authenticationEntryPoint).accessDeniedHandler(accessDeniedHandler);
            })
            .formLogin(AbstractHttpConfigurer::disable)
            .addFilterBefore(new ExceptionHandlerFilter(messageSourceAccessor), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
            .build();
    }


}
