package com.mindplates.bugcase.biz.automation.controller;

import com.mindplates.bugcase.biz.automation.request.TestResultRequest;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/automation/projects/{projectToken}")
@AllArgsConstructor
public class AutomationController {

    private final TestrunService testrunService;

    @Operation(description = "API 이용하여 테스트런 결과를 등록합니다.")
    @PostMapping("/testruns/{testrunSeqNumber}/testcases/{testcaseSeqNumber}")
    public ResponseEntity<HttpStatus> createTestrunResult(
        @PathVariable String projectToken,
        @PathVariable long testrunSeqNumber,
        @PathVariable long testcaseSeqNumber,
        @Valid @RequestBody TestResultRequest testResultRequest) {
        
        boolean done = testrunService.updateTestrunTestcaseResult(projectToken, testrunSeqNumber, testcaseSeqNumber, testResultRequest.getResult(), testResultRequest.getComment());
        testrunService.sendTestrunStatusChangeMessage(projectToken, testrunSeqNumber, testcaseSeqNumber, done);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스가 포함된 테스트런 목록을 조회합니다.")
    @GetMapping("/testcases/{testcaseSeqNumber}/testruns")
    public List<Long> selectTestcaseIncludeTestrunList(@PathVariable String projectToken, @PathVariable Long testcaseSeqNumber) {
        return testrunService.selectTestcaseIncludeTestrunList(projectToken, testcaseSeqNumber);
    }

}



