package com.mindplates.bugcase.biz.config.dto;

import com.mindplates.bugcase.biz.config.entity.Config;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ConfigDTO extends CommonDTO {

    String code;
    String value;

    public ConfigDTO(Config config) {
        if (config != null) {
            this.code = config.getCode();
            this.value = config.getValue();
        }

    }
}
