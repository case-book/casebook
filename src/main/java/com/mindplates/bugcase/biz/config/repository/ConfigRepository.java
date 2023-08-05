package com.mindplates.bugcase.biz.config.repository;

import com.mindplates.bugcase.biz.config.entity.Config;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigRepository extends JpaRepository<Config, String> {

}

