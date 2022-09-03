package com.mindplates.bugcase.biz.config.vo;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SystemInfo {
    private String name;
    private String version;
}
