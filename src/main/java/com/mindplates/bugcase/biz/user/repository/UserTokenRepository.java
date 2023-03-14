package com.mindplates.bugcase.biz.user.repository;


import com.mindplates.bugcase.biz.user.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {

    Optional<UserToken> findByToken(String token);

    List<UserToken> findAllByUserId(Long userId);

    Long countByToken(String token);

    @Modifying
    @Query("UPDATE UserToken ut SET ut.lastAccess = :lastAccess WHERE ut.id = :userTokenId")
    void updateUserLastAccess(Long userTokenId, LocalDateTime lastAccess);
}

