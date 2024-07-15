package com.mindplates.bugcase.common.vo;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SlackMessage {

    private String text;
    private String username;
    private String icon_url;
}
