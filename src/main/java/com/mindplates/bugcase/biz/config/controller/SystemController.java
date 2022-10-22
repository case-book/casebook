package com.mindplates.bugcase.biz.config.controller;

import com.mindplates.bugcase.biz.config.vo.SystemInfo;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateDataResponse;
import io.swagger.v3.oas.annotations.Operation;
import java.util.Arrays;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/configs/systems")
@AllArgsConstructor
public class SystemController {

  private final BuildProperties buildProperties;


  @GetMapping("/version")
  @Operation(summary = "API 버전 조회", description = "API 버전 조회")
  public SystemInfo selectSystemVersion() {
    return SystemInfo.builder().version(buildProperties.getVersion()).name(buildProperties.getName()).build();
  }


  @GetMapping("/testcase/configs")
  @Operation(summary = "테스트 케이스 마스터 데이터 조회")
  public TestcaseTemplateDataResponse selectTestcaseDataInfo() {
    return new TestcaseTemplateDataResponse(Arrays.stream(TestcaseItemType.values()).map((testcaseItemType -> testcaseItemType.toString())).collect(Collectors.toList()),
        Arrays.stream(TestcaseItemCategory.values()).map((testcaseItemCategory -> testcaseItemCategory.toString())).collect(Collectors.toList()));
  }

}
