package com.mindplates.bugcase.biz.config.repository;

import com.mindplates.bugcase.biz.config.entity.Config;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigRepository extends JpaRepository<Config, String> {

    Optional<Config> findByCode(String code);

    List<Config> findByCodeIn(List<String> codes);

}

