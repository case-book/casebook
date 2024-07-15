package com.mindplates.bugcase.common.service;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.SecurityUser;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {

        try {
            UserDTO user = userService.selectUserInfo(Long.parseLong(id));

            return SecurityUser.builder()
                .id(user.getId())
                .roles(user.getActiveSystemRole().toString())
                .name(user.getName())
                .email(user.getEmail())
                .language(user.getLanguage())
                .build();

        } catch (Exception e) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED);

        }


    }

}
