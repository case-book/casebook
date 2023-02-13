package com.mindplates.bugcase.biz.config.vo.request;


import lombok.Data;
import org.hibernate.validator.constraints.URL;

import javax.validation.constraints.NotBlank;

@Data
public class SlackTestRequest {

    @NotBlank
    @URL
    private String slackUrl;

}
