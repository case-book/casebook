package com.mindplates.bugcase.biz.config.controller;

import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.config.service.ConfigService;
import com.mindplates.bugcase.biz.config.vo.request.SetUpRequest;
import com.mindplates.bugcase.biz.config.vo.request.SlackTestRequest;
import com.mindplates.bugcase.biz.config.vo.response.SystemInfoResponse;
import com.mindplates.bugcase.biz.config.vo.response.TimeZoneResponse;
import com.mindplates.bugcase.biz.space.vo.request.SpaceMessageChannelHeaderRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceMessageChannelPayloadRequest;
import com.mindplates.bugcase.biz.space.vo.request.SpaceMessageChannelRequest;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateDataResponse;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.service.SlackService;
import com.mindplates.bugcase.common.service.WebhookService;
import io.swagger.v3.oas.annotations.Operation;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.support.MessageSourceAccessor;
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

    private final SlackService slackService;

    private final WebhookService webhookService;

    private final MessageSourceAccessor messageSourceAccessor;

    @GetMapping("/info")
    @Operation(description = "API 버전 조회")
    public SystemInfoResponse selectSystemVersion() {
        ConfigDTO config = configService.selectConfig("SET_UP");
        return SystemInfoResponse.builder().version(buildProperties.getVersion()).name(buildProperties.getName()).setUp("Y".equals(config.getValue())).build();
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

        if ("Y".equals(config.getValue())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        configService.createSetUpInfo(setUpRequest.getAdminUser().toDTO());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/slack")
    @Operation(summary = "슬랙 메세지 전송 테스트")
    public ResponseEntity<?> sendTestMessageToSlack(@Valid @RequestBody SlackTestRequest slackTestRequest) {
        boolean result = slackService.sendText(slackTestRequest.getSlackUrl(), messageSourceAccessor.getMessage("slack.test.message"));

        if (!result) {
            throw new ServiceException("fail.send.slack.message");
        }

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PostMapping("/webhook")
    @Operation(summary = "웹훅 메세지 전송 테스트")
    public ResponseEntity<?> sendTestMessageByWebhook(@Valid @RequestBody SpaceMessageChannelRequest spaceMessageChannelRequest) {

        // spaceMessageChannelRequest.header를 list<map>으로 변경
        List<Map<String, String>> headers = spaceMessageChannelRequest.getHeaders().stream().map(SpaceMessageChannelHeaderRequest::toMap).collect(Collectors.toList());

        // spaceMessageChannelRequest.payload를 list<map>으로 변경
        List<Map<String, String>> payloads = spaceMessageChannelRequest.getPayloads().stream().map(SpaceMessageChannelPayloadRequest::toMap).collect(Collectors.toList());

        String testMessage = messageSourceAccessor.getMessage("slack.test.message");
        // payloads를 반복하면서, {{message}}라는 value가 있을 경우, testMessage로 치환
        payloads.forEach(payload -> {
            // payload의 values 중에 {{message}}가 있을 경우, value를 testMessage로 변경
            payload.forEach((key, value) -> {
                if (value.contains("{{message}}")) {
                    payload.put(key, value.replace("{{message}}", testMessage));
                }
            });
        });

        // spaceMessageChannelRequest의 json에 {{message}}가 있을 경우, testMessage로 치환
        String jsonMessage = spaceMessageChannelRequest.getJson();
        if (jsonMessage.contains("{{message}}")) {
            jsonMessage = jsonMessage.replace("{{message}}", testMessage);
        }

        boolean result = false;
        if (spaceMessageChannelRequest.getPayloadType().equals(PayloadTypeCode.JSON)) {
            result = webhookService.sendText(spaceMessageChannelRequest.getHttpMethod(), spaceMessageChannelRequest.getUrl(), headers, jsonMessage);
        } else {
            result = webhookService.sendText(spaceMessageChannelRequest.getHttpMethod(), spaceMessageChannelRequest.getUrl(), headers, payloads);
        }



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

}
