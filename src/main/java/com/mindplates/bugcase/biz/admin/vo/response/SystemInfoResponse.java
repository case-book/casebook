package com.mindplates.bugcase.biz.admin.vo.response;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;


@Builder
@NoArgsConstructor
@Getter
public class SystemInfoResponse {

    private Map<String, String> redis;

    private Map<String, String> system;

    public SystemInfoResponse(Map<String, String> redis, Map<String, String> system) {
        this.redis = redis;
        this.system = system;
    }


}
