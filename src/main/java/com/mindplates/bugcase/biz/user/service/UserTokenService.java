package com.mindplates.bugcase.biz.user.service;

import com.mindplates.bugcase.biz.user.dto.UserTokenDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.entity.UserToken;
import com.mindplates.bugcase.biz.user.repository.UserTokenRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserTokenService {

    private final UserTokenRepository userTokenRepository;

    public List<UserTokenDTO> selectUserTokenList(Long userId) {
        List<UserToken> userTokenList = userTokenRepository.findAllByUserId(userId);
        return userTokenList.stream().map(UserTokenDTO::new).collect(Collectors.toList());
    }

    public UserTokenDTO selectUserTokenInfo(String token) {
        UserToken userToken = userTokenRepository.findByToken(token).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "user.token.invalid"));
        return new UserTokenDTO(userToken);
    }

    public UserTokenDTO selectUserTokenInfo(Long id) {
        UserToken userToken = userTokenRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new UserTokenDTO(userToken);
    }

    @Transactional
    public UserTokenDTO createUserToken(UserTokenDTO userTokenDTO) {
        UserToken userToken = UserToken.builder()
                .user(User.builder().id(SessionUtil.getUserId()).build())
                .name(userTokenDTO.getName())
                .enabled(true)
                .build();

        String token = UUID.randomUUID().toString();
        while (userTokenRepository.countByToken(token) > 0) {
            token = UUID.randomUUID().toString();
        }

        userToken.setToken(token);
        userToken = userTokenRepository.save(userToken);
        return new UserTokenDTO(userToken);
    }

    @Transactional
    public UserTokenDTO updateUserTokenLastAccess(Long userTokenId) {
        UserToken userToken = userTokenRepository.findById(userTokenId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        userToken.setLastAccess(LocalDateTime.now());
        return new UserTokenDTO(userTokenRepository.save(userToken));
    }

    @Transactional
    public UserTokenDTO updateUserToken(Long tokenId, UserTokenDTO updateUserToken) {
        UserToken userToken = userTokenRepository.findById(tokenId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        userToken.setName(updateUserToken.getName());
        userToken.setEnabled(updateUserToken.isEnabled());
        return new UserTokenDTO(userTokenRepository.save(userToken));
    }

    @Transactional
    public void deleteUserToken(Long userTokenId) {
        userTokenRepository.deleteById(userTokenId);
    }


}
