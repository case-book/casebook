package com.mindplates.bugcase.biz.config.vo.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SystemInfoResponse {

    private String name;
    private String version;
    private boolean setUp;
}
