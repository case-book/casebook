package com.mindplates.bugcase.biz.user.repository;


import com.mindplates.bugcase.biz.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUuid(String uuid);

    Long countByEmail(String email);

    Long countByEmailAndIdNot(String email, Long exceptUserId);

    Optional<User> findByEmail(String email);







}

