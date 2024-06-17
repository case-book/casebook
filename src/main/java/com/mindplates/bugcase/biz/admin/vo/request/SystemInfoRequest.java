package com.mindplates.bugcase.biz.admin.vo.request;


import com.mindplates.bugcase.biz.config.vo.request.LlmPromptRequest;
import com.mindplates.bugcase.biz.config.vo.response.LlmPromptResponse;
import java.util.List;
import lombok.Data;

@Data
public class SystemInfoRequest {

    private List<LlmPromptRequest> llmPrompts;
}
