package com.mindplates.bugcase.biz.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mindplates.bugcase.biz.ai.dto.AiRequestHistoryDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.config.constant.Constants;
import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.config.service.ConfigService;
import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.openai.api.OpenAiApi.ChatCompletion;
import org.springframework.ai.openai.api.OpenAiApi.ChatCompletionChunk;
import org.springframework.ai.openai.api.OpenAiApi.ChatCompletionMessage;
import org.springframework.ai.openai.api.OpenAiApi.ChatCompletionMessage.Role;
import org.springframework.ai.openai.api.OpenAiApi.ChatCompletionRequest;
import org.springframework.ai.openai.api.OpenAiApi.ChatCompletionRequest.ResponseFormat;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAISimpleClientService {

    private final WebClient webClient;

    private final ConfigService configService;

    private final LlmService llmService;

    private final ObjectMapper objectMapper;

    private final MessageSourceAccessor messageSourceAccessor;


    public String checkApiKey(String url, String apiKey) {
        return this.webClient.get()
            .uri(url + "/models")
            .header("Authorization", "Bearer " + apiKey)
            .retrieve()
            .bodyToMono(String.class)
            .map(response -> messageSourceAccessor.getMessage("llm.config.success"))
            .onErrorResume(e -> {
                if (e instanceof WebClientResponseException) {
                    WebClientResponseException webClientResponseException = (WebClientResponseException) e;
                    if (webClientResponseException.getStatusCode().is4xxClientError()) {
                        return Mono.just(messageSourceAccessor.getMessage("llm.config.invalid.key"));
                    } else {
                        if (webClientResponseException.getMessage() != null) {
                            return Mono.just(webClientResponseException.getMessage());
                        }

                        return Mono.just(messageSourceAccessor.getMessage("common.error.unknownError"));

                    }
                } else if (e instanceof WebClientRequestException) {
                    Throwable cause = e.getCause();
                    if (cause instanceof UnknownHostException) {
                        return Mono.just(messageSourceAccessor.getMessage("llm.config.error.dns"));
                    } else if (cause instanceof IOException) {
                        return Mono.just(cause.getMessage());
                    } else {
                        return Mono.just(cause.getMessage());
                    }
                } else {
                    return Mono.just(e.getMessage());
                }
            })
            .block();

    }


    public List<String> getModelList(String url, String apiKey) {
        return this.webClient.get()
            .uri(url + "/models")
            .header("Authorization", "Bearer " + apiKey)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> {
                List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
                return data.stream()
                    .map(model -> (String) model.get("id"))
                    .collect(Collectors.toList());
            })
            .onErrorResume(e -> {
                throw new ServiceException(e.getMessage());
            })
            .block();
    }

    public ArrayList<Map<String, Object>> getTestcaseMessageContent (TestcaseDTO testcase) {
        List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();
        ArrayList<Map<String, Object>> messages = new ArrayList<>();

        Map<String, Object> testcaseTitle = new HashMap<>();
        testcaseTitle.put("id", "name");
        testcaseTitle.put("label", "테스트케이스 제목");
        testcaseTitle.put("text", testcase.getName());
        messages.add(testcaseTitle);

        for (TestcaseItemDTO testcaseItem : testcaseItems) {
            if (testcaseItem.getType().equals("text") && testcaseItem.getText() != null) {
                Map<String, Object> testcaseItemInfo = new HashMap<>();
                testcaseItemInfo.put("id", testcaseItem.getId());
                testcaseItemInfo.put("label", testcaseItem.getTestcaseTemplateItem().getLabel());
                testcaseItemInfo.put("text", testcaseItem.getText());
                messages.add(testcaseItemInfo);
            }
        }

        return messages;
    }

    public JsonNode rephraseToTestCase(OpenAiDTO openAi, OpenAiModelDTO model, SpaceLlmPromptDTO prompt, TestcaseDTO testcase, long userId) throws JsonProcessingException {

        ArrayList<Map<String, Object>> messages = getTestcaseMessageContent(testcase);

        /*
        org.springframework.ai.retry.NonTransientAiException: 400 - {
            "error": {
            "message": "Invalid parameter: 'response_format' of type 'json_schema' is not supported with this model. Learn more about supported models at the Structured Outputs guide: https://platform.openai.com/docs/guides/structured-outputs",
                "type": "invalid_request_error",
                "param": null,
                "code": null
        }
}*/
        String jsonSchema = """
        {
            "type": "object",
            "properties": {
                "steps": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "explanation": { "type": "string" },
                            "output": { "type": "string" }
                        },
                        "required": ["explanation", "output"],
                        "additionalProperties": false
                    }
                },
                "final_answer": { "type": "string" }
            },
            "required": ["steps", "final_answer"],
            "additionalProperties": false
        }
        """;

        String jsonSchema2 = """
        {
            "type": "object",
            "properties": {
                "list": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": { "type": "string" },
                            "label": { "type": "string" },
                            "text": { "type": "string" }
                        },
                        "required": ["id", "label", "text"],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["list"],
            "additionalProperties": false
        }
        """;

        OpenAiApi openAiApi = new OpenAiApi(openAi.getApiKey());

        var openAiChatOptions = OpenAiChatOptions.builder()
            .withTemperature(0.4f)
            .build();

        var chatModel = new OpenAiChatModel(openAiApi, openAiChatOptions);

        Message systemMessage = new SystemMessage(prompt.getSystemRole());
        Message userMessage1 = new UserMessage(prompt.getPrompt());
        Message message = new UserMessage(objectMapper.writeValueAsString(messages));

        Prompt aiPrompt = new Prompt(List.of(systemMessage, userMessage1, message),
            OpenAiChatOptions.builder()
                .withModel("gpt-4o-mini")
                .withResponseFormat(new ResponseFormat(ResponseFormat.Type.JSON_SCHEMA, jsonSchema2))
                .build());

        ChatResponse response = chatModel.call(aiPrompt);


        // ChatCompletionMessage chatCompletionMessage = new ChatCompletionMessage("Hello world", Role.USER);

        // ResponseEntity<ChatCompletion> response = openAiApi.chatCompletionEntity(new ChatCompletionRequest(List.of(chatCompletionMessage), model.getCode(), 0.8f, false));


        return objectMapper.readTree(response.getResult().getOutput().getContent());



    }


    private Map<String, Object> createRequestBody(String targetContent, String model, SpaceLlmPromptDTO prompt) {

        List<ConfigDTO> llmConfigs = configService.selectLlmConfigList();

        Map<String, String> valueByKey = new HashMap<>();
        for (ConfigDTO llmConfig : llmConfigs) {
            valueByKey.put(llmConfig.getCode(), llmConfig.getValue());
        }

        String prefix = valueByKey.get(Constants.LLM_PREFIX);
        String postfix = valueByKey.get(Constants.LLM_POSTFIX);

        if (prefix == null || postfix == null) {
            throw new ServiceException("llm.config.not.found");
        }

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", prompt.getSystemRole() + prefix + "\n" + prompt.getPrompt() + postfix);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", targetContent);

        ArrayList<Map<String, Object>> messages = new ArrayList<>();
        messages.add(systemMessage);
        messages.add(message);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);

        return requestBody;
    }

    private JsonNode parseResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode contentNode = jsonNode.path("choices").get(0).path("message").path("content");
            if (contentNode.isMissingNode()) {
                throw new RuntimeException("Invalid response structure");
            }
            return contentNode;
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse response", e);
        }
    }


}