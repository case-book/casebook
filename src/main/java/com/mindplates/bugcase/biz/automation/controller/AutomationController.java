package com.mindplates.bugcase.biz.automation.controller;

import com.mindplates.bugcase.biz.automation.request.TestResultRequest;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/automation/projects/{projectId}")
@AllArgsConstructor
public class AutomationController {

    private final TestrunService testrunService;

    @Operation(description = "")
    @PostMapping("/testruns/{testrunSeqNumber}/testcases/{testcaseSeqNumber}")
    public ResponseEntity<HttpStatus> createTestrunResult(@PathVariable long projectId, @PathVariable long testrunSeqNumber, @PathVariable long testcaseSeqNumber, @RequestBody TestResultRequest testResultRequest) {
        testrunService.updateTestrunTestcaseResult(projectId, testrunSeqNumber, testcaseSeqNumber, testResultRequest.getResult(), testResultRequest.getComment());
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
