package com.mindplates.bugcase.framework.security;

import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.common.entity.SystemRole;
import com.mindplates.bugcase.common.vo.SecurityUser;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.expression.WebExpressionVoter;

@RequiredArgsConstructor
public class ResourceVoter extends WebExpressionVoter {

  public static final Pattern USERS_PATTERN = Pattern.compile("^/api/users/my/?(.*)?$");
  public static final Pattern PROJECTS_PATTERN = Pattern.compile("^/api/(.*)/projects(.*)");
  public static final Pattern SPACES_PATTERN = Pattern.compile("^/api/spaces/?(.*)?");
  public static final Pattern ADMIN_PATTERN = Pattern.compile("^/api/admin/?(.*)?");

  List<Pattern> allPassPatterns = Arrays.asList(Pattern.compile("^/api/spaces/(.*)/accessible$"), Pattern.compile("^/api/spaces/(.*)/applicants$"));
  private final SpaceService spaceService;

  @Override
  public boolean supports(ConfigAttribute attribute) {
    return true;
  }

  @Override
  public boolean supports(Class clazz) {
    return true;
  }

  @Override
  public int vote(Authentication authentication, FilterInvocation fi, Collection<ConfigAttribute> attributes) {

    if (authentication instanceof UsernamePasswordAuthenticationToken) {
      SecurityUser user = (SecurityUser) authentication.getPrincipal();
      Long userId = user.getId();

      HttpServletRequest request = fi.getRequest();

      boolean allPass = allPassPatterns.stream().anyMatch((pattern) -> pattern.matcher(request.getRequestURI()).matches());
      if (allPass) {
        return ACCESS_GRANTED;
      }

      Matcher usersMatcher = USERS_PATTERN.matcher(request.getRequestURI());
      Matcher spacesMatcher = SPACES_PATTERN.matcher(request.getRequestURI());
      Matcher projectsMatcher = PROJECTS_PATTERN.matcher(request.getRequestURI());
      Matcher adminMatcher = ADMIN_PATTERN.matcher(request.getRequestURI());
      if (adminMatcher.matches()) {
        return SystemRole.ROLE_ADMIN.toString().equals(user.getRoles()) ? ACCESS_GRANTED : ACCESS_DENIED;
      } else if (usersMatcher.matches()) {
        return ACCESS_GRANTED;
      } else if (projectsMatcher.matches()) {
        String spaceCode = projectsMatcher.group(1);
        if (StringUtils.isNotBlank(spaceCode) && spaceService.selectIsSpaceMember(spaceCode, userId)) {
          return ACCESS_GRANTED;
        }
      } else if (spacesMatcher.matches()) {

        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        if (method == HttpMethod.PUT || method == HttpMethod.DELETE) {
          String spaceInfo = spacesMatcher.group(1);

          if (spaceInfo.indexOf('/') > -1) {
            String[] values = spaceInfo.split("/");
            if (values.length > 0) {
              spaceInfo = values[0];
            }
          }

          boolean isNumber = NumberUtils.isCreatable(spaceInfo);
          boolean isAdmin = false;
          if (isNumber) {
            isAdmin = spaceService.selectIsSpaceAdmin(Long.parseLong(spaceInfo), userId);
          } else {
            isAdmin = spaceService.selectIsSpaceAdmin(spaceInfo, userId);
          }

          if (isAdmin) {
            return ACCESS_GRANTED;
          }
          return ACCESS_DENIED;
        } else if (method == HttpMethod.POST) {
          return ACCESS_GRANTED;
        } else {
          String spaceInfo = spacesMatcher.group(1);

          if (spaceInfo.indexOf('/') > -1) {
            String[] values = spaceInfo.split("/");
            if (values.length > 0) {
              spaceInfo = values[0];
            }
          }

          if (!StringUtils.isBlank(spaceInfo) && !"my".equals(spaceInfo)) {
            boolean isUser = spaceService.selectIsSpaceMember(spaceInfo, userId);
            if (isUser) {
              return ACCESS_GRANTED;
            } else {
              return ACCESS_DENIED;
            }
          }
          return ACCESS_GRANTED;
        }

      }

    }

    return ACCESS_DENIED;


  }


}
