package com.mindplates.bugcase.biz.user.service;

import com.mindplates.bugcase.biz.user.dto.RefreshTokenDTO;
import com.mindplates.bugcase.biz.user.entity.RefreshToken;
import com.mindplates.bugcase.biz.user.repository.RefreshTokenRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.time.LocalDateTime;
import java.util.Optional;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final int REFRESH_TOKEN_LENGTH = 64;
    private final RefreshTokenRepository refreshTokenRepository;
    @Value("${spring.jwt.refreshExpireMinutes}")
    private Long refreshExpireMinutes;

    public void invalidateTokenByUserId(long userId) {
        refreshTokenRepository.findByUserId(userId).ifPresent(
            refreshToken -> {
                refreshToken.setValue(null);
                refreshToken.setExpirationDate(null);
                refreshTokenRepository.save(refreshToken);
            }
        );
    }

    @Transactional
    public RefreshTokenDTO upsert(long userId) {
        String generatedToken = RandomStringUtils.randomAlphanumeric(REFRESH_TOKEN_LENGTH);
        LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(refreshExpireMinutes);
        Optional<RefreshToken> refreshTokenOptional = refreshTokenRepository.findByUserId(userId);
        RefreshToken refreshToken;
        if (refreshTokenOptional.isPresent()) {
            refreshToken = refreshTokenOptional.get();
            refreshToken.setValue(generatedToken);
            refreshToken.setExpirationDate(expirationDate);
        } else {
            refreshToken = RefreshToken.builder()
                .value(generatedToken)
                .userId(userId)
                .expirationDate(expirationDate)
                .build();
        }
        return new RefreshTokenDTO(refreshTokenRepository.save(refreshToken));
    }

    @Transactional
    public RefreshTokenDTO validateAndUpdateToken(long userId, String tokenValue, LocalDateTime currentDateTime) {
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(userId).orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED));
        // AccessToken 재발급과 함께 Refresh Token 도 갱신하므로, 요청한 RefreshToken 값과 Expiration Date 를 만족해야한다.
        if (tokenValue.equals(refreshToken.getValue()) && currentDateTime.isBefore(refreshToken.getExpirationDate())) {
            String updatedTokenValue = RandomStringUtils.randomAlphanumeric(REFRESH_TOKEN_LENGTH);
            refreshToken.setValue(updatedTokenValue);
            return new RefreshTokenDTO(refreshTokenRepository.save(refreshToken));
        }
        throw new ServiceException(HttpStatus.UNAUTHORIZED);
    }
}
