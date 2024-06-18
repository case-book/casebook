package com.mindplates.bugcase.biz.admin.vo.response;


import com.mindplates.bugcase.biz.config.vo.response.LlmPromptResponse;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Builder
@Getter
@Setter
public class SystemInfoResponse {

    private Map<String, String> redis;

    private Map<String, String> system;

    private List<LlmPromptResponse> llmPrompts;


}
