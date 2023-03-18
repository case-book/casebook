package com.mindplates.bugcase.framework.security;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.dto.UserTokenDTO;
import com.mindplates.bugcase.biz.user.service.UserTokenService;
import com.mindplates.bugcase.common.vo.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Base64;

@RequiredArgsConstructor
@Component
public class UserTokenProvider {
    private final UserTokenService userTokenService;

    public Authentication getAuthentication(String token) {
        String authorizationCredentials = token.substring("Basic".length()).trim();
        String[] decodedCredentials = new String(Base64.getDecoder().decode(authorizationCredentials)).split(":");
        UserTokenDTO userTokenDTO = userTokenService.selectUserTokenInfo(decodedCredentials[1]);
        UserDTO user = userTokenDTO.getUser();

        UserDetails userDetails = SecurityUser.builder()
                .id(user.getId())
                .roles(user.getActiveSystemRole().toString())
                .name(user.getName())
                .email(user.getEmail())
                .language(user.getLanguage())
                .build();

        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());

    }


    public String resolveToken(HttpServletRequest req) {
        return req.getHeader("authorization");
    }

    public boolean validateToken(String jwtToken) {
        try {
            String authorizationCredentials = jwtToken.substring("Basic".length()).trim();
            String[] decodedCredentials = new String(Base64.getDecoder().decode(authorizationCredentials)).split(":");
            return decodedCredentials.length == 2;
        } catch (Exception e) {
            return false;
        }
    }
}
