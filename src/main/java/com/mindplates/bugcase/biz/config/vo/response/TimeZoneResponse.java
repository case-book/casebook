package com.mindplates.bugcase.biz.config.vo.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class TimeZoneResponse {

    private String zoneId;
    private String name;
}
