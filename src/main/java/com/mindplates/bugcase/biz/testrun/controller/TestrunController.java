package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunListDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunCachedService;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunCreateRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunHookRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunReopenRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunResultRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunTestcaseGroupTestcaseItemRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunTesterRandomChangeRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunTesterRequest;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunUpdateRequest;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunHookResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunListResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunTestcaseGroupTestcaseItemResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunTestcaseGroupTestcaseResponse;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.TestrunHookResult;
import io.swagger.v3.oas.annotations.Operation;
import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testruns")
@AllArgsConstructor
public class TestrunController {

    private static final int REPORT_PAGE_SIZE = 10;
    private final TestrunService testrunService;

    private final ProjectFileService projectFileService;

    private final HttpRequestUtil httpRequestUtil;

    private final TestrunCachedService testrunCachedService;

    @Operation(description = "프로젝트 테스트런 생성")
    @PostMapping("")
    public ResponseEntity<HttpStatus> createTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody TestrunCreateRequest testrunRequest) {

        TestrunDTO testrun = testrunRequest.toDTO();

        if (testrun.getTestrunUsers() == null || testrun.getTestrunUsers().isEmpty()) {
            throw new ServiceException("error.no.testrun.users");
        }

        TestrunDTO result = testrunService.createTestrunInfo(spaceCode, testrun);

        // 시작 후 훅 호출
        result.getTestrunHookList(TestrunHookTiming.AFTER_START).forEach(testrunHook -> {
            testrunHook.request(httpRequestUtil);
            testrunHook.setTestrun(TestrunDTO.builder().id(result.getId()).build());
            testrunService.updateTestrunHookResult(testrunHook);
        });

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "프로젝트 테스트런 재오픈")
    @PutMapping("/{testrunId}/reopen")
    public ResponseEntity<HttpStatus> reopenTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId,
        @Valid @RequestBody TestrunReopenRequest testrunReopenRequest) {

        TestrunDTO result = testrunService.reopenTestrunInfo(spaceCode, projectId, testrunId, testrunReopenRequest);

        // 시작 후 훅 호출
        result.getTestrunHookList(TestrunHookTiming.AFTER_START).forEach(testrunHook -> {
            testrunHook.request(httpRequestUtil);
            testrunHook.setTestrun(TestrunDTO.builder().id(result.getId()).build());
            testrunService.updateTestrunHookResult(testrunHook);
        });

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "진행중인 테스트런 목록 조회")
    @GetMapping("")
    public List<TestrunListResponse> selectTestrunList(@PathVariable String spaceCode, @PathVariable long projectId) {
        return testrunCachedService.selectOpenedProjectTestrunList(spaceCode, projectId).stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }


    @Operation(description = "종료된 테스트런 목록 조회")
    @GetMapping("/closed")
    public List<TestrunListResponse> selectClosedTestrunList(
        @PathVariable String spaceCode,
        @PathVariable long projectId,
        @RequestParam(value = "start") LocalDateTime start,
        @RequestParam(value = "end") LocalDateTime end
    ) {
        return testrunService.selectClosedProjectTestrunList(projectId, start, end).stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "종료된 테스트런 목록 조회")
    @GetMapping("/reports")
    public List<TestrunListResponse> selectReportList(
        @PathVariable String spaceCode,
        @PathVariable long projectId,
        @RequestParam(value = "pageNo") int pageNo
    ) {
        return testrunService.selectClosedProjectTestrunList(projectId, pageNo, REPORT_PAGE_SIZE).stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }

    // TODO 삭제 예정
    @Operation(description = "최근 종료된 TOP 3 테스트런 목록 조회")
    @GetMapping("/closed/latest")
    public List<TestrunListResponse> selectLatestClosedTestrunList(@PathVariable String spaceCode, @PathVariable long projectId) {
        return testrunService.selectLatestClosedTop3ProjectTestrunList(spaceCode, projectId).stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }


    @Operation(description = "테스트런 변경")
    @PutMapping("/{testrunId}")
    public TestrunListResponse updateTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody TestrunUpdateRequest testrunRequest) {
        TestrunListDTO testrun = testrunService.updateTestrunInfo(spaceCode, testrunRequest.toDTO());
        return new TestrunListResponse(testrun);
    }


    @Operation(description = "테스트런 상세 조회")
    @GetMapping("/{testrunId}")
    public TestrunResponse selectTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        TestrunDTO testrun = testrunService.selectProjectTestrunInfo(testrunId);
        return new TestrunResponse(testrun);
    }


    @Operation(description = "테스트런 삭제")
    @DeleteMapping("/{testrunId}")
    public ResponseEntity<HttpStatus> deleteTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        testrunService.deleteProjectTestrunInfo(spaceCode, projectId, testrunId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "테스트런 닫기")
    @PutMapping("/{testrunId}/status/closed")
    public ResponseEntity<HttpStatus> updateTestrunClosed(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        TestrunDTO result = testrunService.updateProjectTestrunStatusClosed(spaceCode, projectId, testrunId);

        // 종료 후 훅 호출
        result.getTestrunHookList(TestrunHookTiming.AFTER_END).forEach(testrunHook -> {
            testrunHook.request(httpRequestUtil);
            testrunHook.setTestrun(TestrunDTO.builder().id(result.getId()).build());
            testrunService.updateTestrunHookResult(testrunHook);
        });

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 열기")
    @PutMapping("/{testrunId}/status/opened")
    public ResponseEntity<HttpStatus> updateTestrunOpened(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        testrunService.updateProjectTestrunStatusOpened(spaceCode, projectId, testrunId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 테스트케이스 상세 조회")
    @GetMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}")
    public TestrunTestcaseGroupTestcaseResponse selectTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupId,
        @PathVariable long testrunTestcaseGroupTestcaseId) {
        TestrunTestcaseGroupTestcaseDTO testcase = testrunService.selectTestrunTestcaseGroupTestcaseInfo(spaceCode, testrunId, testrunTestcaseGroupTestcaseId);
        return new TestrunTestcaseGroupTestcaseResponse(testcase);
    }

    @Operation(description = "테스트런 결과 아이템 입력 (단건)")
    @PutMapping("/{testrunId}/testcases/{testrunTestcaseGroupTestcaseId}/items/{testcaseTemplateItemId}")
    public TestrunTestcaseGroupTestcaseItemResponse updateTestrunResultItems(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId,
        @PathVariable long testcaseTemplateItemId, @Valid @RequestBody TestrunTestcaseGroupTestcaseItemRequest testrunTestcaseGroupTestcaseItemRequest) {
        TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItems = testrunTestcaseGroupTestcaseItemRequest.toDTO();
        TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItemList = testrunService.updateTestrunTestcaseGroupTestcaseItem(spaceCode, projectId, testrunId,
            testrunTestcaseGroupTestcaseItems);
        return new TestrunTestcaseGroupTestcaseItemResponse(testrunTestcaseGroupTestcaseItemList);
    }

    @Operation(description = "테스트런 결과 입력")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/result")
    public Boolean updateTestrunResult(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupTestcaseId,
        @Valid @RequestBody TestrunResultRequest testrunResultRequest) {
        return testrunService.updateTestrunTestcaseResult(spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId, testrunResultRequest.getTestResult());
    }

    @Operation(description = "테스트런 테스트케이스 테스터 변경")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/tester")
    public ResponseEntity<HttpStatus> updateTestrunTestcaseTester(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId,
        @PathVariable long testrunTestcaseGroupTestcaseId, @Valid @RequestBody TestrunTesterRequest testrunTesterRequest) {
        testrunService.updateTestrunTestcaseTester(spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId, testrunTesterRequest.getTesterId(), SessionUtil.getUserId(true));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 테스트케이스 테스터 랜덤 변경")
    @PutMapping("/{testrunId}/tester/random")
    public ResponseEntity<HttpStatus> updateTestrunTestcaseTesterRandom(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId,
        @Valid @RequestBody TestrunTesterRandomChangeRequest testrunTesterRandomChangeRequest) {
        testrunService.updateTestrunTestcaseTesterRandom(spaceCode, projectId, testrunId, testrunTesterRandomChangeRequest.getTesterId(), testrunTesterRandomChangeRequest.getTargetId(),
            testrunTesterRandomChangeRequest.getTarget(), testrunTesterRandomChangeRequest.getReason());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "사용자에게 할당된 테스트런 목록 조회")
    @GetMapping("/assigned")
    public List<TestrunResponse> selectUserAssignedTestrunList(@PathVariable String spaceCode, @PathVariable long projectId) {
        List<TestrunDTO> testruns = testrunService.selectUserAssignedTestrunList(spaceCode, projectId, SessionUtil.getUserId());
        return testruns.stream().map(TestrunResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 테스트런 히스토리 조회")
    @GetMapping("/history")
    public List<TestrunListResponse> selectTestrunHistoryList(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam(value = "start") LocalDateTime start,
        @RequestParam(value = "end") LocalDateTime end) {
        List<TestrunDTO> testruns = testrunService.selectProjectTestrunHistoryList(spaceCode, projectId, start, end);
        return testruns.stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "테스트런 훅 실행")
    @PostMapping("/hooks/execute")
    public TestrunHookResponse executeTestrunHook(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody TestrunHookRequest testrunHookRequest) {
        TestrunHookDTO testrunHook = testrunHookRequest.toDTO();
        TestrunHookResult testrunHookResult = testrunHook.request(httpRequestUtil);
        return new TestrunHookResponse(testrunHook, testrunHookResult);
    }

    @Operation(description = "테스트런 진행 상황 알림 채널 메세지 발송")
    @PostMapping("/{testrunId}/notify")
    public ResponseEntity<HttpStatus> notifyTestrunProgress(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId) {
        testrunService.notifyTestrun(spaceCode, projectId, testrunId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{testrunId}/images")
    public ProjectFileResponse createTestrunImage(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testrunId, @RequestParam("file") MultipartFile file,
        @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {
        ProjectFileDTO result = projectFileService.createProjectTestrunFile(projectId, testrunId, name, size, type, file);
        return new ProjectFileResponse(result, spaceCode, projectId);
    }


}

