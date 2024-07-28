package com.mindplates.bugcase.biz.config.service;

import com.mindplates.bugcase.biz.config.constant.Constants;
import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.config.entity.Config;
import com.mindplates.bugcase.biz.config.repository.ConfigRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.service.UserService;
import com.mindplates.bugcase.common.code.SystemRole;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class ConfigService {

    private final ConfigRepository configRepository;
    private final UserService userService;

    public ConfigDTO selectConfig(String code) {
        Config config = configRepository.findByCode(code).orElse(null);
        if (config != null) {
            return new ConfigDTO(config);
        }

        return null;
    }

    public List<ConfigDTO> selectConfigList(List<String> codes) {
        List<Config> configs = configRepository.findByCodeIn(codes);
        return configs.stream().map(ConfigDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public void createConfigInfo(String code, String value) {
        Config target = Config.builder().code(code).value(value).build();
        configRepository.save(target);
    }

    @Transactional
    public void updateConfigInfo(List<ConfigDTO> configs) {
        List<Config> list = configs.stream().map((configDTO -> Config.builder().code(configDTO.getCode()).value(configDTO.getValue()).build())).collect(Collectors.toList());
        configRepository.saveAll(list);
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

    @Transactional
    public void createLlmPromptFix(String prefix, String postfix) {
        Config prefixConfig = configRepository.findById(Constants.LLM_PREFIX).orElse(null);
        Config postfixConfig = configRepository.findById(Constants.LLM_POSTFIX).orElse(null);
        if (prefixConfig == null) {
            prefixConfig = Config.builder().code(Constants.LLM_PREFIX).value(prefix).build();
            postfixConfig = Config.builder().code(Constants.LLM_POSTFIX).value(prefix).build();
        } else {
            prefixConfig.setValue(prefix);
            postfixConfig.setValue(postfix);
        }

        configRepository.save(prefixConfig);
        configRepository.save(postfixConfig);

    }


    public List<ConfigDTO> selectLlmConfigList() {
        List<String> codes = new ArrayList();
        codes.add(Constants.LLM_PREFIX);
        codes.add(Constants.LLM_POSTFIX);
        codes.add(Constants.LLM_SYSTEM_ROLE);
        codes.add(Constants.LLM_PROMPT);
        return selectConfigList(codes);
    }


}
