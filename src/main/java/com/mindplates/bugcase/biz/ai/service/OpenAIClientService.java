package com.mindplates.bugcase.biz.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.biz.ai.dto.AiRequestHistoryDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.config.constant.Constants;
import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
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
import org.springframework.ai.openai.api.OpenAiApi.ChatCompletionRequest.ResponseFormat;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAIClientService {

    private final WebClient webClient;

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
                if (e instanceof WebClientResponseException webClientResponseException) {
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


    public ArrayList<Map<String, Object>> getTestcaseMessageContent(TestcaseDTO testcase) {
        List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();
        ArrayList<Map<String, Object>> messages = new ArrayList<>();

        Map<String, Object> testcaseTitle = new HashMap<>();
        testcaseTitle.put("id", "name");
        testcaseTitle.put("label", "테스트케이스 제목");
        testcaseTitle.put("text", testcase.getName());
        messages.add(testcaseTitle);

        for (TestcaseItemDTO testcaseItem : testcaseItems) {
            if (testcaseItem.getType() != null && testcaseItem.getType().equals("text") && testcaseItem.getText() != null) {
                Map<String, Object> testcaseItemInfo = new HashMap<>();
                testcaseItemInfo.put("id", testcaseItem.getId());
                testcaseItemInfo.put("label", testcaseItem.getTestcaseTemplateItem().getLabel());
                testcaseItemInfo.put("text", testcaseItem.getText());
                messages.add(testcaseItemInfo);
            }
        }

        return messages;
    }

    public JsonNode rephraseToTestCase(String openApiKey, OpenAiModelDTO model, List<ConfigDTO> llmConfigs, SpaceLlmPromptDTO prompt, TestcaseDTO testcase, long userId)
        throws JsonProcessingException {

        ArrayList<Map<String, Object>> messages = getTestcaseMessageContent(testcase);

        String responseSchema = """
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

        OpenAiApi openAiApi = new OpenAiApi(openApiKey);

        OpenAiChatOptions openAiChatOptions = OpenAiChatOptions.builder().withTemperature(0.5).build();
        OpenAiChatModel chatModel = new OpenAiChatModel(openAiApi, openAiChatOptions);

        ConfigDTO prefix = llmConfigs.stream().filter(llmConfig -> llmConfig.getCode().equals(Constants.LLM_PREFIX)).findFirst().orElse(null);
        Message systemMessage = new SystemMessage(prompt.getSystemRole());
        Message userMessage = new UserMessage((prefix != null ? prefix.getValue() : "") + prompt.getPrompt());
        Message targetContent = new UserMessage(objectMapper.writeValueAsString(messages));

        try {
            Prompt aiPrompt = new Prompt(List.of(systemMessage, userMessage, targetContent),
                OpenAiChatOptions.builder().withModel(model.getCode()).withResponseFormat(new ResponseFormat(ResponseFormat.Type.JSON_SCHEMA, responseSchema)).build());
            ChatResponse response = chatModel.call(aiPrompt);

            try {
                AiRequestHistoryDTO aiRequestHistory = AiRequestHistoryDTO.builder()
                    .aiModel(model)
                    .requester(UserDTO.builder().id(userId).build())
                    .request(objectMapper.writeValueAsString(List.of(systemMessage, userMessage, targetContent)))
                    .build();
                aiRequestHistory.setResponse(response.getResult().getOutput().getContent());
                llmService.createAiRequestHistoryInfo(aiRequestHistory);
            } catch (Exception e) {
                log.error("Failed to parse response", e);
            }

            return objectMapper.readTree(response.getResult().getOutput().getContent());
        } catch (NonTransientAiException e) {

            String message = e.getMessage();
            int startIndex = message.indexOf('{');
            int endIndex = message.lastIndexOf('}');
            if (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
                String errorJsonString = message.substring(startIndex, endIndex + 1);
                JsonNode errorMessageNode = objectMapper.readTree(errorJsonString);
                if (errorMessageNode != null) {
                    JsonNode errorNode = errorMessageNode.get("error");
                    if (errorNode != null) {
                        String param = errorNode.get("code").isNull() ? errorNode.get("message").asText() : errorNode.get("code").asText();
                        throw new ServiceException(HttpStatus.BAD_REQUEST, "error.ai.request", new String[]{param});
                    }
                }
            }

            throw new ServiceException(HttpStatus.BAD_REQUEST, "error.ai.request", new String[]{""});

        } catch (Exception e) {
            throw e;
        }


    }

}