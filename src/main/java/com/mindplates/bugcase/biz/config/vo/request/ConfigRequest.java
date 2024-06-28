package com.mindplates.bugcase.biz.config.vo.request;

import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import lombok.Data;

@Data
public class ConfigRequest {

    private String code;
    private String value;

    public ConfigDTO toDTO() {
        return ConfigDTO.builder().code(code).value(value).build();
    }

}
