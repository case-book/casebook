package com.mindplates.bugcase.biz.config.vo.response;

import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ConfigInfoResponse {

    private String code;
    private String value;

    public ConfigInfoResponse(ConfigDTO config) {
        if (config != null) {
            this.code = config.getCode();
            this.value = config.getValue();
        }
    }
}
