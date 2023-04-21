package com.mindplates.bugcase.biz.automation.controller;

import com.mindplates.bugcase.biz.automation.request.TestResultRequest;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.common.message.MessageSendService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/automation/projects/{projectToken}")
@AllArgsConstructor
public class AutomationController {

    private final TestrunService testrunService;

    private final MessageSendService messageSendService;

    @Operation(description = "")
    @PostMapping("/testruns/{testrunSeqNumber}/testcases/{testcaseSeqNumber}")
    public ResponseEntity<HttpStatus> createTestrunResult(@PathVariable String projectToken, @PathVariable long testrunSeqNumber, @PathVariable long testcaseSeqNumber, @RequestBody TestResultRequest testResultRequest) {
        boolean done = testrunService.updateTestrunTestcaseResult(projectToken, testrunSeqNumber, testcaseSeqNumber, testResultRequest.getResult(), testResultRequest.getComment());
        testrunService.sendTestrunStatusChangeMessage(projectToken, testrunSeqNumber, testcaseSeqNumber, done);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
