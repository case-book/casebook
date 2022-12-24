package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.testrun.vo.request.*;
import com.mindplates.bugcase.biz.testrun.vo.response.*;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testruns")
@AllArgsConstructor
public class TestrunController {

    private final TestrunService testrunService;

    private final ProjectService projectService;

    @Operation(description = "프로젝트 테스트런 목록 조회")
    @GetMapping("")
    public List<TestrunListResponse> selectTestrunList(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam(value = "status") String status) {
        List<Testrun> testruns = testrunService.selectProjectTestrunList(spaceCode, projectId, status);
        return testruns.stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 테스트런 생성")
    @PostMapping("")
    public TestrunListResponse createTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody TestrunRequest testrunRequest) {
        Testrun testrun = testrunRequest.buildEntity();
        return new TestrunListResponse(testrunService.createTestrunInfo(spaceCode, testrun));
    }

    @Operation(description = "테스트런 상세 조회")
    @GetMapping("/{testrunId}")
    public TestrunResponse selectTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        Testrun testrun = testrunService.selectProjectTestrunInfo(testrunId);
        return new TestrunResponse(testrun);
    }

    @Operation(description = "테스트런 삭제")
    @DeleteMapping("/{testrunId}")
    public ResponseEntity<?> deleteTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {

        testrunService.deleteProjectTestrunInfo(spaceCode, projectId, testrunId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 닫기")
    @PutMapping("/{testrunId}/status/closed")
    public ResponseEntity<?> updateTestrunClosed(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        testrunService.updateProjectTestrunStatusClosed(spaceCode, projectId, testrunId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 테스트 케이스 상세 조회")
    @GetMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}")
    public TestrunTestcaseGroupTestcaseResponse selectTestrunInfo(@PathVariable String spaceCode,
                                                                  @PathVariable long projectId,
                                                                  @PathVariable long testrunId,
                                                                  @PathVariable long testrunTestcaseGroupId,
                                                                  @PathVariable long testrunTestcaseGroupTestcaseId) {
        TestrunTestcaseGroupTestcase testcase = testrunService.selectTestrunTestcaseGroupTestcaseInfo(testrunTestcaseGroupTestcaseId);
        return new TestrunTestcaseGroupTestcaseResponse(testcase);
    }

    @Operation(description = "테스트런 결과 아이템 입력")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}")
    public List<TestrunTestcaseGroupTestcaseItemResponse> updateTestrunResultItems(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @Valid @RequestBody TestrunResultItemsRequest testrunResultItemsRequest) {

        List<TestrunTestcaseGroupTestcaseItem> testrunTestcaseGroupTestcaseItems = testrunResultItemsRequest.buildEntity();

        List<TestrunTestcaseGroupTestcaseItem> testrunTestcaseGroupTestcaseItemList = testrunService.updateTestrunTestcaseGroupTestcaseItems(testrunTestcaseGroupTestcaseItems);
        return testrunTestcaseGroupTestcaseItemList.stream().map(TestrunTestcaseGroupTestcaseItemResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "테스트런 결과 입력")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/result")
    public ResponseEntity<?> updateTestrunResult(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupTestcaseId, @Valid @RequestBody TestrunResultRequest testrunResultRequest) {
        testrunService.updateTestrunTestcaseResult(testrunId, testrunTestcaseGroupTestcaseId, testrunResultRequest.getTestResult());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 테스트케이스 테스터 변경")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/tester")
    public ResponseEntity<?> updateTestrunResult(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupTestcaseId, @Valid @RequestBody TestrunTesterRequest testrunTesterRequest) {
        testrunService.updateTestrunTestcaseTester(testrunTestcaseGroupTestcaseId, testrunTesterRequest.getTesterId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 코멘트 입력")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/comments")
    public TestrunTestcaseGroupTestcaseCommentResponse updateTestrunComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @Valid @RequestBody TestrunTestcaseGroupTestcaseCommentRequest testrunTestcaseGroupTestcaseCommentRequest) {

        TestrunTestcaseGroupTestcaseComment testrunTestcaseGroupTestcaseComment = testrunTestcaseGroupTestcaseCommentRequest.buildEntity();
        TestrunTestcaseGroupTestcaseComment result = testrunService.updateTestrunTestcaseGroupTestcaseComment(testrunTestcaseGroupTestcaseComment);
        return new TestrunTestcaseGroupTestcaseCommentResponse(result);
    }

    @Operation(description = "테스트런 코멘트 입력")
    @DeleteMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/comments/{testrunTestcaseGroupTestcaseCommentId}")
    public ResponseEntity<?> updateTestrunComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupTestcaseCommentId) {
        testrunService.deleteTestrunTestcaseGroupTestcaseComment(testrunTestcaseGroupTestcaseCommentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "사용자에게 할당된 테스트런 목록 조회")
    @GetMapping("/assigned")
    public List<TestrunResponse> selectUserAssignedTestrunList(@PathVariable String spaceCode, @PathVariable long projectId) {

        List<Testrun> testruns = testrunService.selectUserAssignedTestrunList(spaceCode, projectId, SessionUtil.getUserId());
        return testruns.stream().map(TestrunResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 테스트런 히스토리 조회")
    @GetMapping("/history")
    public List<TestrunListResponse> selectTestrunHistoryList(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam(value = "start") LocalDateTime start, @RequestParam(value = "end") LocalDateTime end ) {
        List<Testrun> testruns = testrunService.selectProjectTestrunHistoryList(spaceCode, projectId, start, end);
        return testruns.stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }


}

