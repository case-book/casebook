package com.mindplates.bugcase.biz.admin.vo.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Builder
@Getter
@Setter
public class PromptInfoResponse {

    private String systemRole;

    private String prompt;

    private String postPrompt;


}
