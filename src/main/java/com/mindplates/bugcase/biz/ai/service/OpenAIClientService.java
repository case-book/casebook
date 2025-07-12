package com.mindplates.bugcase.biz.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceLlmPromptDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
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

        throw new ServiceException(HttpStatus.BAD_REQUEST, "error.ai.request", new String[]{""});


    }

}