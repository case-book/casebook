package com.mindplates.bugcase.biz.user.service;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserCachedService {

    private final UserRepository userRepository;


    @Cacheable(key = "{#userId}", value = CacheConfig.USER)
    public UserDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new UserDTO(user);
    }


}
