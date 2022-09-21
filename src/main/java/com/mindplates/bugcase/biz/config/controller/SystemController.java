package com.mindplates.bugcase.biz.config.controller;

import com.mindplates.bugcase.biz.config.vo.SystemInfo;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.framework.annotation.DisableLogin;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/configs/systems")
@AllArgsConstructor
public class SystemController {

    private final BuildProperties buildProperties;

    @DisableLogin
    @GetMapping("/version")
    @Operation(summary = "API 버전 조회", description = "API 버전 조회")
    public SystemInfo selectSystemVersion() {
        return SystemInfo.builder().version(buildProperties.getVersion()).name(buildProperties.getName()).build();
    }

    @DisableLogin
    @GetMapping("/testcase/item-types")
    @Operation(summary = "테스트 케이스 아이템 타입 조회")
    public List<String> selectTestcaseItemTypeList() {
        return Arrays.stream(TestcaseItemType.values()).map((testcaseItemType -> testcaseItemType.toString())).collect(Collectors.toList());
    }


}
