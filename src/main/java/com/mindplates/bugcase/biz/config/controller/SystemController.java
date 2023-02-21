package com.mindplates.bugcase.biz.config.controller;

import com.mindplates.bugcase.biz.config.dto.ConfigDTO;
import com.mindplates.bugcase.biz.config.service.ConfigService;
import com.mindplates.bugcase.biz.config.vo.SystemInfo;
import com.mindplates.bugcase.biz.config.vo.request.SetUpRequest;
import com.mindplates.bugcase.biz.config.vo.request.SlackTestRequest;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateDataResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.service.SlackService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/configs/systems")
@AllArgsConstructor
public class SystemController {

    private final BuildProperties buildProperties;

    private final ConfigService configService;

    private final SlackService slackService;

    private final MessageSourceAccessor messageSourceAccessor;

    @GetMapping("/info")
    @Operation(summary = "API 버전 조회", description = "API 버전 조회")
    public SystemInfo selectSystemVersion() {
        ConfigDTO config = configService.selectConfig("SET_UP");
        return SystemInfo.builder().version(buildProperties.getVersion()).name(buildProperties.getName()).setUp("Y".equals(config.getValue())).build();
    }

    @GetMapping("/testcase/configs")
    @Operation(summary = "테스트케이스 마스터 데이터 조회")
    public TestcaseTemplateDataResponse selectTestcaseDataInfo() {
        return new TestcaseTemplateDataResponse(Arrays.stream(TestcaseItemType.values()).map((testcaseItemType -> testcaseItemType.toString())).collect(Collectors.toList()), Arrays.stream(TestcaseItemCategory.values()).map((testcaseItemCategory -> testcaseItemCategory.toString())).collect(Collectors.toList()));
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

}
