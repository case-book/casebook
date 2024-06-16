package com.mindplates.bugcase.biz.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.biz.ai.dto.AiRequestHistoryDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Slf4j
@Service
public class OpenAIClientService {

    private final WebClient webClient;

    @Autowired
    private LlmService llmService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MessageSourceAccessor messageSourceAccessor;

    public OpenAIClientService() {
        this.webClient = WebClient.builder().build();
    }

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
            }).block();
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

    private String getPrompt() {

        StringBuilder prompt = new StringBuilder();
        /*
        prompt.append("You are an expert test engineer. Please perform the following tasks on the provided JSON array")
            .append("\n")
            //.append("1. Only transform the content of objects with the key \"text\".")
            //.append("\n")
            //.append("2. Include the rest of the content in the response exactly as it was in the request.")
            //.append("\n")
            .append("1. Transform the content of the key \"text\" into rephrase the following sentence to a formal test case format.")
            .append("\n")
            .append("2. Translate the content of the key \"text\" to the provided language.")
            .append("\n")
            .append("3. The response should only include the resulting JSON : ");
*/

        // prompt.append("JSON 컨텐츠의 text 필드의 데이터들이 사용자가 쉽게 이해 및 수행할 수 있는 테스트케이스 문장으로 변환하면서, 모든 문장이 일관된 형태의 문장이 되도록 단어, 어조, 어미를 일관되게 재구성. 응답 메세지에는 변환된 JSON 형식의 데이터만 포함되어야 한다.: ");

        prompt
            .append("JSON 컨텐츠의 text 필드의 데이터들이 사용자가 쉽게 이해 및 수행할 수 있는 테스트케이스 문장으로 변경한다.")
            .append("문장의 맞춤법이 틀린 경우 올바르게 수정한다.")
            .append("변경하는 모든 문장이 하나의 관점에서 일관된 형태의 문장이 되도록 문장에 포함된 단어, 문장의 어조, 어미 일관되게 재구성한다.")
            .append("제공되는 문장이 HTML인 경우, HTML 문법이 최대한 유지되도록 변경한다.")
            .append("응답 메세지에는 변환된 JSON 형식의 데이터만 포함되어야 한다.: ");;

        return prompt.toString();
    }

    private Map<String, Object> createRequestBody(String prompt, String model) {

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are an expert test engineer.");

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", getPrompt() + prompt);

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