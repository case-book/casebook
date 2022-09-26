package com.mindplates.bugcase.framework.resolver;


import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.UserSession;
import lombok.AllArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import javax.servlet.http.HttpServletRequest;

@AllArgsConstructor
public class MethodArgumentResolver implements HandlerMethodArgumentResolver {

    private final SessionUtil sessionUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(UserSession.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

        return sessionUtil.getUserInfo((HttpServletRequest) webRequest.getNativeRequest());
    }

}
