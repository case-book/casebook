package com.mindplates.bugcase.framework.config;

import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.framework.security.CustomAuthenticationEntryPoint;
import com.mindplates.bugcase.framework.security.JwtAuthenticationFilter;
import com.mindplates.bugcase.framework.security.JwtTokenProvider;
import com.mindplates.bugcase.framework.security.CustomAccessDeniedHandler;
import com.mindplates.bugcase.framework.security.ResourceVoter;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
  private final CustomAuthenticationEntryPoint authenticationEntryPoint;
  private final CustomAccessDeniedHandler accessDeniedHandler;
  private final SpaceService spaceService;

  @Value("${bug-case.corsUrls}")
  private String[] corsUrls;

  @Bean
  public AccessDecisionManager accessDecisionManager() {

    RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
    roleHierarchy.setHierarchy("ROLE_ADMIN > ROLE_USER");

    DefaultWebSecurityExpressionHandler handler = new DefaultWebSecurityExpressionHandler();
    handler.setRoleHierarchy(roleHierarchy);

    ResourceVoter resourceVoter = new ResourceVoter(spaceService);
    resourceVoter.setExpressionHandler(handler);

    List<AccessDecisionVoter<? extends Object>> decisionVoters
        = Arrays.asList(resourceVoter);
    return new AffirmativeBased(decisionVoters);
  }

  @Override
  public void configure(WebSecurity web) {
    web.ignoring().antMatchers("/api/configs/systems/**")
        .antMatchers(HttpMethod.OPTIONS, "/**")
        .antMatchers("/api/configs/systems/**")
        .antMatchers("/api/users/login", "/api/users/logout", "/api/users/join");

  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.cors().and().csrf().disable().sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint)
        .accessDeniedHandler(accessDeniedHandler)
        .and()
        .authorizeRequests().anyRequest().authenticated()
        .accessDecisionManager(accessDecisionManager())
        .and()
        .formLogin().disable();

    http.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
        UsernamePasswordAuthenticationFilter.class);

  }


}
