package com.mindplates.bugcase.biz.notification.repository;

import com.mindplates.bugcase.biz.notification.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByUserIdOrderByCreationDateDesc(Long userId, Pageable Pageable);

    List<Notification> findAllByUserIdAndCreationDateAfterOrderByCreationDateDesc(Long userId, LocalDateTime lastSeen, Pageable Pageable);

    Long countByUserId(Long userId);
}

