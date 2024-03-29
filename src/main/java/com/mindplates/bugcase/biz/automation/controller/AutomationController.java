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

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/automation/projects/{projectToken}")
@AllArgsConstructor
public class AutomationController {

    private final TestrunService testrunService;

    private final MessageSendService messageSendService;



    // curl -u kevin.12@kakaocorp.com:3ad56155-6faf-475c-abba-9897fcf6fb56 -d "{""result"":""SUCCESS"", ""comment"":""your comment""}" -H "Content-Type: application/json"  -X POST http://localhost:8080/api/automation/projects/d6ae0639-13a5-4f7d-b413-0f63369c94f2/testruns/147/testcases/40
    // curl -u kevin.12@kakaocorp.com:3ad56155-6faf-475c-abba-9897fcf6fb56 -d "{""result"":""PASSED"", ""comment"":""your comment""}" -H "Content-Type: application/json"  -X POST http://localhost:8080/api/automation/projects/d6ae0639-13a5-4f7d-b413-0f63369c94f2/testruns/147/testcases/40
    // curl -u kevin.12@kakaocorp.com:3ad56155-6faf-475c-abba-9897fcf6fb56 -d "{""result"":""FAILED"", ""comment"":""your comment""}" -H "Content-Type: application/json"  -X POST http://localhost:8080/api/automation/projects/d6ae0639-13a5-4f7d-b413-0f63369c94f2/testruns/147/testcases/40
    @Operation(description = "")
    @PostMapping("/testruns/{testrunSeqNumber}/testcases/{testcaseSeqNumber}")
    public ResponseEntity<HttpStatus> createTestrunResult(@PathVariable String projectToken, @PathVariable long testrunSeqNumber, @PathVariable long testcaseSeqNumber, @RequestBody TestResultRequest testResultRequest) {
        boolean done = testrunService.updateTestrunTestcaseResult(projectToken, testrunSeqNumber, testcaseSeqNumber, testResultRequest.getResult(), testResultRequest.getComment());
        testrunService.sendTestrunStatusChangeMessage(projectToken, testrunSeqNumber, testcaseSeqNumber, done);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // curl -u kevin.12@kakaocorp.com:3ad56155-6faf-475c-abba-9897fcf6fb56 http://localhost:8080/api/automation/projects/d6ae0639-13a5-4f7d-b413-0f63369c94f2/testcases/40/testruns
    // [147]
    @Operation(description = "")
    @GetMapping("/testcases/{testcaseSeqNumber}/testruns")
    public List<Long> selectTestcaseIncludeTestrunList(@PathVariable String projectToken, @PathVariable Long testcaseSeqNumber) {
        return testrunService.selectTestcaseIncludeTestrunList(projectToken, testcaseSeqNumber);
    }


}



