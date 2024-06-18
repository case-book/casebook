package com.mindplates.bugcase.biz.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.biz.ai.dto.AiRequestHistoryDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.config.dto.LlmPromptDTO;
import com.mindplates.bugcase.biz.config.service.LlmPromptService;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.AiConfig;
import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.MessageSourceAccessor;
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


    private final LlmPromptService llmPromptService;


    private final AiConfig aiConfig;


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

    public Mono<JsonNode> rephraseToTestCase(OpenAiDTO openAi, OpenAiModelDTO model, TestcaseDTO testcase, long userId) throws JsonProcessingException {

        List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();
        ArrayList<Map<String, Object>> messages = new ArrayList<>();

        Map<String, Object> testcaseTitle = new HashMap<>();
        testcaseTitle.put("id", "name");
        testcaseTitle.put("label", "테스트케이스 제목");
        testcaseTitle.put("text", testcase.getName());
        messages.add(testcaseTitle);

        for (TestcaseItemDTO testcaseItem : testcaseItems) {
            if (TestcaseItemType.EDITOR.equals(testcaseItem.getTestcaseTemplateItem().getType()) ||
                TestcaseItemType.TEXT.equals(testcaseItem.getTestcaseTemplateItem().getType())
            ) {
                Map<String, Object> testcaseItemInfo = new HashMap<>();
                testcaseItemInfo.put("id", testcaseItem.getId());
                testcaseItemInfo.put("label", testcaseItem.getTestcaseTemplateItem().getLabel());
                testcaseItemInfo.put("text", testcaseItem.getText());
                messages.add(testcaseItemInfo);
            }
        }

        Map<String, Object> requestBody = createRequestBody(objectMapper.writeValueAsString(messages), model.getCode());

        AiRequestHistoryDTO aiRequestHistory = AiRequestHistoryDTO.builder()
            .aiModel(model)
            .requester(UserDTO.builder().id(userId).build())
            .request(objectMapper.writeValueAsString(requestBody))
            .build();

        return webClient.post()
            .uri(openAi.getUrl() + "/chat/completions")
            .header("Authorization", "Bearer " + openAi.getApiKey())
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .doOnNext(response -> {
                try {
                    aiRequestHistory.setResponse(response);
                    llmService.createAiRequestHistoryInfo(aiRequestHistory);
                } catch (Exception e) {
                    log.error("Failed to parse response", e);
                }
            })
            .map(this::parseResponse);
    }


    private Map<String, Object> createRequestBody(String targetContent, String model) {

        LlmPromptDTO llmPrompt = llmPromptService.selectActivatedLlmPromptInfo();
        if (llmPrompt == null) {
            llmPrompt = new LlmPromptDTO();
            llmPrompt.setPrompt(aiConfig.getPrompt());
            llmPrompt.setSystemRole(aiConfig.getSystemRole());
        }

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", llmPrompt.getSystemRole());

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", llmPrompt.getPrompt() + aiConfig.getPostPrompt() + ":" + targetContent);

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