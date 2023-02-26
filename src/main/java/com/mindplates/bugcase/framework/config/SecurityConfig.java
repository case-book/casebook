package com.mindplates.bugcase.framework.config;

import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.framework.handler.ExceptionHandlerFilter;
import com.mindplates.bugcase.framework.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
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

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final SpaceService spaceService;

    private final MessageSourceAccessor messageSourceAccessor;
    private final ProjectService projectService;

    @Value("${bug-case.corsUrls}")
    private String[] corsUrls;

    @Bean
    public AccessDecisionManager accessDecisionManager() {

        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        roleHierarchy.setHierarchy("ROLE_ADMIN > ROLE_USER");

        DefaultWebSecurityExpressionHandler handler = new DefaultWebSecurityExpressionHandler();
        handler.setRoleHierarchy(roleHierarchy);

        ResourceVoter resourceVoter = new ResourceVoter(spaceService, projectService);
        resourceVoter.setExpressionHandler(handler);

        List<AccessDecisionVoter<? extends Object>> decisionVoters
                = Arrays.asList(resourceVoter);
        return new AffirmativeBased(decisionVoters);
    }

    @Override
    public void configure(WebSecurity web) {
        // 인증 및 인가 예외 처리
        // TODO api 경로 제외 모두 패스하도록 설정해야함
        web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()) // favicon.ico 등의 인증을 시도하지 않음
                .mvcMatchers(HttpMethod.OPTIONS, "/(.*)")
                .mvcMatchers("/")
                .mvcMatchers("/**.html")
                .mvcMatchers("/**.png")
                .mvcMatchers("/**.svg")
                .mvcMatchers("/**.ico")
                .mvcMatchers("/**.txt")
                .mvcMatchers("/**.json")
                .mvcMatchers("/static/**")
                .mvcMatchers("/api/configs/systems/**")
                .mvcMatchers("/api/users/login", "/api/users/logout", "/api/users/join")
                .mvcMatchers("/api/**/projects//**/testcases/(.*)/images/**")
                .mvcMatchers("/api/**/projects//**/testruns//**/images/**")
                .mvcMatchers("/api/**/projects//**/images//**")
                .mvcMatchers("/ws/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
                .and()
                // TODO 아래 설정이 동작하지 않아서, allPassPatterns를 Voter에서 처리하도록 수정
                // .authorizeRequests()
                // .mvcMatchers("^/api/users/my/?(.*)?$")
                // .permitAll()
                // .and()
                .authorizeRequests()
                .anyRequest()
                .authenticated()
                .accessDecisionManager(accessDecisionManager())
                .and()
                .formLogin().disable();


        http.addFilterBefore(new ExceptionHandlerFilter(messageSourceAccessor), UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

    }


}
