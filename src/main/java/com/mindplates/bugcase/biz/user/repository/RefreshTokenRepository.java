package com.mindplates.bugcase.biz.user.repository;

import com.mindplates.bugcase.biz.user.entity.RefreshToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByUserIdAndValue(long userId, String value);
}
