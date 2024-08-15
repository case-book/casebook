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
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

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

    @Override
    public void configure(WebSecurity web) {
        // 인증 및 인가 예외 처리
        web.ignoring()
            // .requestMatchers(PathRequest.toStaticResources().atCommonLocations()) // favicon.ico 등의 인증을 시도하지 않음
            .mvcMatchers(HttpMethod.OPTIONS, "/(.*)")
            .regexMatchers("^(?!/?api).+$")
            .mvcMatchers("/api/configs/systems/**")
            .mvcMatchers("/api/users/login", "/api/users/logout", "/api/users/join", "/api/users/refresh")
            .mvcMatchers("/api/**/projects/**/testcases/**/images/**")
            .mvcMatchers("/api/**/projects/**/testruns/**/images/**")
            .mvcMatchers("/api/**/projects/**/images/**")
            .mvcMatchers("/api/links/**")
            .mvcMatchers("/ws/**");
    }

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


}
