package com.mindplates.bugcase.biz.user.repository;


import com.mindplates.bugcase.biz.user.entity.User;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUuid(String uuid);

    Long countByEmail(String email);

    Long countByEmailAndIdNot(String email, Long exceptUserId);

    @Modifying
    @Query("UPDATE User u SET u.lastSeen = :lastSeen WHERE u.id = :userId")
    void updateUserLastSeen(Long userId, LocalDateTime lastSeen);

    @Query("SELECT u.id, u.name, u.email FROM User u WHERE u.id = :userId")
    Optional<User> findNameById(long userId);

    Optional<User> findByEmail(String email);


}

