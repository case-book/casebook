package com.mindplates.bugcase.biz.config.repository;

import com.mindplates.bugcase.biz.config.entity.Config;
import com.mindplates.bugcase.biz.notification.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ConfigRepository extends JpaRepository<Config, String> {

    Long countByCode(String code);
}

