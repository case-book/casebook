package com.mindplates.bugcase.biz.config.controller;

import com.mindplates.bugcase.biz.admin.vo.response.PromptInfoResponse;
import com.mindplates.bugcase.biz.ai.service.OpenAIClientService;
import com.mindplates.bugcase.biz.ai.vo.request.LlmRequest;
import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.config.service.ConfigService;
import com.mindplates.bugcase.biz.config.vo.request.SetUpRequest;
import com.mindplates.bugcase.biz.config.vo.response.ConfigInfoResponse;
import com.mindplates.bugcase.biz.config.vo.response.SystemInfoResponse;
import com.mindplates.bugcase.biz.config.vo.response.TimeZoneResponse;
import com.mindplates.bugcase.biz.space.vo.request.SpaceMessageChannelRequest;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateDataResponse;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.service.MessageChannelService;
import com.mindplates.bugcase.framework.config.AiConfig;
import io.swagger.v3.oas.annotations.Operation;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/configs/systems")
@AllArgsConstructor
public class SystemController {

    private final BuildProperties buildProperties;

    private final ConfigService configService;

    private final MessageChannelService messageChannelService;

    private final OpenAIClientService openAIClientService;

    private final AiConfig aiConfig;

    @GetMapping("/info")
    @Operation(description = "API 버전 조회")
    public SystemInfoResponse selectSystemVersion() {
        ConfigDTO config = configService.selectConfig("SET_UP");
        return SystemInfoResponse.builder().version(buildProperties.getVersion()).name(buildProperties.getName()).setUp(config != null && "Y".equals(config.getValue())).build();
    }

    @GetMapping("/timezones")
    @Operation(description = "타임존 목록 조회")
    public List<TimeZoneResponse> selectTimeZoneList(@RequestParam(value = "language") String language) {

        Locale locale = new Locale(language);
        Set<String> zoneIds = ZoneId.getAvailableZoneIds();
        List<TimeZoneResponse> timezones = new ArrayList<>();

        for (String id : zoneIds) {
            ZoneId zoneId = ZoneId.of(id);
            timezones.add(TimeZoneResponse.builder().zoneId(id).name(zoneId.getDisplayName(TextStyle.FULL, locale)).build());
        }

        return timezones;
    }

    @GetMapping("/testcase/configs")
    @Operation(summary = "테스트케이스 마스터 데이터 조회")
    public TestcaseTemplateDataResponse selectTestcaseDataInfo() {
        return new TestcaseTemplateDataResponse(Arrays.stream(TestcaseItemType.values()).map((testcaseItemType -> testcaseItemType.toString())).collect(Collectors.toList()),
            Arrays.stream(TestcaseItemCategory.values()).map((testcaseItemCategory -> testcaseItemCategory.toString())).collect(Collectors.toList()));
    }

    @PostMapping("/setup")
    @Operation(summary = "시스템 설정 정보 등록")
    public ResponseEntity<?> createSetUpInfo(@Valid @RequestBody SetUpRequest setUpRequest) {

        ConfigDTO config = configService.selectConfig("SET_UP");

        if (config != null && "Y".equals(config.getValue())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        configService.createSetUpInfo(setUpRequest.getAdminUser().toDTO());

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PostMapping("/message")
    @Operation(summary = "메세지 전송 테스트")
    public ResponseEntity<?> sendTestMessage(@Valid @RequestBody SpaceMessageChannelRequest spaceMessageChannelRequest) {
        boolean result = messageChannelService.sendTestMessage(spaceMessageChannelRequest.toDTO());
        if (!result) {
            throw new ServiceException("fail.send.webhook.message");
        }

        return new ResponseEntity<>(HttpStatus.OK);


    }

    @GetMapping("/errors/arithmetic")
    @Operation(summary = "에러 생성")
    public ResponseEntity<?> arithmetic() {
        int zero = 0;
        int result = 10 / zero;

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @GetMapping("/errors/service")
    @Operation(summary = "에러 생성")
    public ResponseEntity<?> service() {
        if (true) {
            throw new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @GetMapping("/channels/types")
    public List<MessageChannelTypeCode> getChannelTypeCodeList() {
        return Arrays.asList(MessageChannelTypeCode.values());

    }

    @PostMapping("/llm")
    @Operation(summary = "LLM 설정 테스트")
    public ResponseEntity<String> llmConfigTest(@Valid @RequestBody LlmRequest llmRequest) {

        if (LlmTypeCode.OPENAI.equals(llmRequest.getLlmTypeCode())) {
            try {
                String result = openAIClientService.checkApiKey(llmRequest.getOpenAi().getUrl(), llmRequest.getOpenAi().getApiKey());
                return new ResponseEntity<>(result, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
            }

        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    @GetMapping("/llm/config")
    public List<ConfigInfoResponse> getLlmConfig() {
        List<ConfigDTO> list = configService.selectLlmConfigList();
        return list.stream().map(ConfigInfoResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "시스템 정보 조회")
    @GetMapping("/llm/config/default")
    public PromptInfoResponse selectDefaultPromptInfo() {
        return PromptInfoResponse.builder()
            .prompt(aiConfig.getLLM_PROMPT())
            .systemRole(aiConfig.getLLM_SYSTEM_ROLE())
            .prefix(aiConfig.getLLM_PREFIX())
            .build();
    }


}
