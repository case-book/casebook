package com.mindplates.bugcase.common.service;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
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

    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {

        User user = userRepository.findById(Long.parseLong(id)).orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED));

        return SecurityUser.builder()
            .id(user.getId())
            .roles(user.getActiveSystemRole().toString())
            .name(user.getName())
            .email(user.getEmail())
            .language(user.getLanguage())
            .build();

    }

}
