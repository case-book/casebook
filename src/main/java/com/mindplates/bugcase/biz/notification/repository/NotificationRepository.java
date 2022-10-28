package com.mindplates.bugcase.biz.notification.repository;

import com.mindplates.bugcase.biz.notification.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  List<Notification> findAllByUserId(Long userId);


}

