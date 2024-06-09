package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum MessageChannelTypeCode {

    SLACK("SLACK"),
    WATCH_CENTER("WATCH_CENTER"),
    WEBHOOK("WEBHOOK");
    private String code;

}
