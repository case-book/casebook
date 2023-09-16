package com.mindplates.bugcase.biz.user.repository;


import com.mindplates.bugcase.biz.user.entity.UserToken;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {

    Optional<UserToken> findByToken(String token);

    List<UserToken> findAllByUserId(Long userId);

    Long countByToken(String token);

}

