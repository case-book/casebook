package com.mindplates.bugcase.common.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.framework.config.OpenAIConfig;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service

public class OpenAIClientService {

    @Value("${openai.apiKey}")
    private String apiKey;

    private final WebClient webClient;

    @Autowired
    private ObjectMapper objectMapper;

    public OpenAIClientService(OpenAIConfig openAIConfig) {
        this.apiKey = openAIConfig.getApiKey();
        this.webClient = WebClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .defaultHeader("Authorization", "Bearer " + this.apiKey)
            .build();
    }

    public Mono<JsonNode> rephraseToTestCase(TestcaseDTO testcase) throws JsonProcessingException {

        List<TestcaseItemDTO> testcaseItems = testcase.getTestcaseItems();

        ArrayList<Map<String, Object>> messages = new ArrayList<>();

        Map<String, Object> testcaseTitle = new HashMap<>();
        testcaseTitle.put("id", "name");
        testcaseTitle.put("label", "테스트케이스 제목");
        testcaseTitle.put("text", testcase.getName());

        messages.add(testcaseTitle);

        for (TestcaseItemDTO testcaseItem : testcaseItems) {

            Map<String, Object> testcaseItemInfo = new HashMap<>();
            testcaseItemInfo.put("id", testcaseItem.getId());
            testcaseItemInfo.put("label", testcaseItem.getTestcaseTemplateItem().getLabel());
            testcaseItemInfo.put("text", testcaseItem.getText());
            messages.add(testcaseItemInfo);
        }

        return webClient.post()
            .uri("/chat/completions")
            .bodyValue(createRequestBody(objectMapper.writeValueAsString(messages)))
            .retrieve()
            .bodyToMono(String.class)
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

        prompt.append("JSON 컨텐츠의 text 필드의 데이터들이 모두 일관된 형태의 어조, 어미를 가지도록, 사용자가 쉽게 이해 및 수행할 수 있는 테스트케이스 문장으로 변환해줘. 응답 메세지에는 변환된 JSON 형식의 데이터만 포함되어야 한다.: ");





        return prompt.toString();
    }

    private Map<String, Object> createRequestBody(String prompt) {

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
        requestBody.put("model", "gpt-3.5-turbo");
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