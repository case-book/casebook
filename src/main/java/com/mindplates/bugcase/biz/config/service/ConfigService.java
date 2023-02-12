package com.mindplates.bugcase.biz.config.service;

import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.config.entity.Config;
import com.mindplates.bugcase.biz.config.repository.ConfigRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.common.code.SystemRole;
import com.mindplates.bugcase.common.util.MappingUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class ConfigService {

    private final ConfigRepository configRepository;

    private final MappingUtil mappingUtil;

    private final UserService userService;

    public ConfigDTO selectConfig(String code) {
        return new ConfigDTO(configRepository.findById(code).orElse(null));
    }

    @Transactional
    public ConfigDTO createConfig(ConfigDTO config) {
        return new ConfigDTO(configRepository.save(mappingUtil.convert(config, Config.class)));
    }

    @Transactional
    public ConfigDTO updateConfig(ConfigDTO config) {
        return new ConfigDTO(configRepository.save(mappingUtil.convert(config, Config.class)));
    }

    @Transactional
    public void deleteConfig(ConfigDTO config) {
        configRepository.delete(mappingUtil.convert(config, Config.class));
    }

    @Transactional
    public void createSetUpInfo(UserDTO adminUser) {
        userService.createUser(adminUser, SystemRole.ROLE_ADMIN);
        Config setUpConfig = configRepository.findById("SET_UP").orElse(null);
        if (setUpConfig == null) {
            setUpConfig = Config.builder().code("SET_UP").value("Y").build();
        } else {
            setUpConfig.setValue("Y");
        }
        configRepository.save(setUpConfig);
    }


}
