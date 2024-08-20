package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.testrun.dto.TestrunCommentDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseCommentDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunCommentService;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunCommentRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunTestcaseGroupTestcaseCommentRequest;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunCommentResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunTestcaseGroupTestcaseCommentResponse;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testruns/{testrunId}/comments")
@AllArgsConstructor
public class TestrunCommentController {

    private final TestrunCommentService testrunCommentService;

    @Operation(description = "테스트런 코멘트 입력")
    @PostMapping
    public TestrunCommentResponse createTestrunComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId,
        @Valid @RequestBody TestrunCommentRequest testrunCommentRequest) {
        TestrunCommentDTO testrunComment = testrunCommentService.createTestrunComment(projectId, testrunId, SessionUtil.getUserId(true), testrunCommentRequest.toDTO());
        return new TestrunCommentResponse(testrunComment);
    }

    @Operation(description = "테스트런 코멘트 목록 조회")
    @GetMapping
    public List<TestrunCommentResponse> selectTestrunCommentList(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        List<TestrunCommentDTO> testrunCommentList = testrunCommentService.selectTestrunCommentList(projectId, testrunId);
        return testrunCommentList.stream().map(TestrunCommentResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "테스트런 코멘트 삭제")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<HttpStatus> deleteTestrunComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long commentId) {
        testrunCommentService.deleteTestrunCommentInfo(projectId, testrunId, commentId, SessionUtil.getUserId(true));
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "테스트런 테스트케이스 코멘트 입력")
    @PutMapping("/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/comments")
    public TestrunTestcaseGroupTestcaseCommentResponse updateTestrunTestcaseComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId,
        @Valid @RequestBody TestrunTestcaseGroupTestcaseCommentRequest testrunTestcaseGroupTestcaseCommentRequest) {
        TestrunTestcaseGroupTestcaseCommentDTO result = testrunCommentService.updateTestrunTestcaseGroupTestcaseComment(testrunId, testrunTestcaseGroupTestcaseCommentRequest.toDTO(),
            SessionUtil.getUserId(true));
        return new TestrunTestcaseGroupTestcaseCommentResponse(result);
    }

    @Operation(description = "테스트런 테스트케이스 코멘트 삭제")
    @DeleteMapping("/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/comments/{testrunTestcaseGroupTestcaseCommentId}")
    public ResponseEntity<HttpStatus> deleteTestrunTestcaseComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId,
        @PathVariable long testrunTestcaseGroupTestcaseCommentId) {
        testrunCommentService.deleteTestrunTestcaseGroupTestcaseComment(testrunId, testrunTestcaseGroupTestcaseCommentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}

