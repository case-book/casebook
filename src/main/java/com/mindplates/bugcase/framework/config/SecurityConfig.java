package com.mindplates.bugcase.framework.config;

import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.framework.handler.ExceptionHandlerFilter;
import com.mindplates.bugcase.framework.security.CustomAccessDeniedHandler;
import com.mindplates.bugcase.framework.security.CustomAuthenticationEntryPoint;
import com.mindplates.bugcase.framework.security.JwtAuthenticationFilter;
import com.mindplates.bugcase.framework.security.JwtTokenProvider;
import com.mindplates.bugcase.framework.security.MethodFinder;
import com.mindplates.bugcase.framework.security.ResourceVoter;
import com.mindplates.bugcase.framework.security.UserTokenAuthenticationFilter;
import com.mindplates.bugcase.framework.security.UserTokenProvider;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.access.vote.AffirmativeBased;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
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
    public AccessDecisionManager accessDecisionManager() {

        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        roleHierarchy.setHierarchy("ROLE_ADMIN > ROLE_USER");

        DefaultWebSecurityExpressionHandler handler = new DefaultWebSecurityExpressionHandler();
        handler.setRoleHierarchy(roleHierarchy);

        ResourceVoter resourceVoter = new ResourceVoter(spaceService, projectService, methodFinder);
        resourceVoter.setExpressionHandler(handler);

        List<AccessDecisionVoter<? extends Object>> decisionVoters = Collections.singletonList(resourceVoter);
        return new AffirmativeBased(decisionVoters);
    }

    /*
    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors()
            .and()
            .csrf()
            .disable()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(authenticationEntryPoint)
            .accessDeniedHandler(accessDeniedHandler)
            .and()
            .authorizeRequests()
            .antMatchers("/api/**")
            .authenticated()
            .accessDecisionManager(accessDecisionManager())
            .and()
            .formLogin().disable()
            .addFilterBefore(new ExceptionHandlerFilter(messageSourceAccessor), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(new UserTokenAuthenticationFilter(userTokenProvider), JwtAuthenticationFilter.class);
    }
    */

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .sessionManagement((httpSecuritySessionManagementConfigurer -> {
                httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            }))
            .authorizeHttpRequests(authorizeRequests -> {
                authorizeRequests
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/configs/systems/**").permitAll() // "^(?!/?api).+$"
                    .requestMatchers("/api/users/login", "/api/users/logout", "/api/users/join", "/api/users/refresh").permitAll()
                    .requestMatchers("/api/**/projects/**/testcases/**/images/**", "/api/**/projects/**/testruns/**/images/**", "/api/**/projects/**/images/**").permitAll()
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
            .addFilterAfter(new UserTokenAuthenticationFilter(userTokenProvider), JwtAuthenticationFilter.class);

        http.setSharedObject(AccessDecisionManager.class, accessDecisionManager());

        return http.build();
    }

}
