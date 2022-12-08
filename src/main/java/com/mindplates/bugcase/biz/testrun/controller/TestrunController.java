package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunResultRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunTestcaseGroupTestcaseItemRequest;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunListResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunTestcaseGroupTestcaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

    @Operation(description = "테스트런 상세 삭제")
    @DeleteMapping("/{testrunId}")
    public ResponseEntity<?> deleteTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        testrunService.deleteProjectTestrunInfo(testrunId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 닫기")
    @PutMapping("/{testrunId}/status/closed")
    public ResponseEntity<?> updateTestrunClosed(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        testrunService.updateProjectTestrunStatusClosed(testrunId);
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

    @Operation(description = "테스트런 닫기")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}")
    public ResponseEntity<?> updateTestrunResult(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @Valid @RequestBody TestrunResultRequest testrunResultRequest) {

        List<TestrunTestcaseGroupTestcaseItem> testrunTestcaseGroupTestcaseItems = testrunResultRequest.buildEntity();

        testrunService.updateTestrunTestcaseGroupTestcaseItems(testrunTestcaseGroupTestcaseItems);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}

