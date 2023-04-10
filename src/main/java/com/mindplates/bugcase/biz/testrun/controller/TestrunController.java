package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.testrun.dto.*;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.testrun.vo.request.*;
import com.mindplates.bugcase.biz.testrun.vo.response.*;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.code.TestrunCreationTypeCode;
import com.mindplates.bugcase.common.message.MessageSendService;
import com.mindplates.bugcase.common.message.vo.MessageData;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testruns")
@AllArgsConstructor
public class TestrunController {

    private final TestrunService testrunService;

    private final ProjectFileService projectFileService;

    private final MessageSendService messageSendService;

    @Operation(description = "프로젝트 테스트런 목록 조회")
    @GetMapping("")
    public List<TestrunListResponse> selectTestrunList(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam(value = "status") String status, @RequestParam(value = "testrunCreationType") TestrunCreationTypeCode testrunCreationType) {
        List<TestrunDTO> testruns;

        if (TestrunCreationTypeCode.CREATE.equals(testrunCreationType)) {
            testruns = testrunService.selectProjectTestrunList(spaceCode, projectId, status, TestrunCreationTypeCode.CREATE);
        } else {
            testruns = testrunService.selectProjectReserveTestrunList(spaceCode, projectId, testrunCreationType);
        }


        return testruns.stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트 테스트런 생성")
    @PostMapping("")
    public TestrunListResponse createTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody TestrunCreateRequest testrunRequest) {
        TestrunDTO testrun = testrunRequest.buildEntity();
        TestrunDTO createdTestrun = testrunService.createTestrunInfo(spaceCode, testrun);

        MessageData createdTestrunData = MessageData.builder().type("TESTRUN-CREATED").build();
        createdTestrunData.addData("testrun", createdTestrun);
        messageSendService.sendTo("projects/" + projectId, createdTestrunData);

        return new TestrunListResponse(createdTestrun);
    }

    @Operation(description = "프로젝트 테스트런 변경")
    @PutMapping("")
    public TestrunListResponse updateTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody TestrunUpdateRequest testrunRequest) {
        TestrunDTO testrun = testrunRequest.buildEntity();
        return new TestrunListResponse(testrunService.updateTestrunInfo(spaceCode, testrun));
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
        testrunService.updateProjectTestrunStatusClosed(spaceCode, projectId, testrunId);
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
    public TestrunTestcaseGroupTestcaseResponse selectTestrunInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupId, @PathVariable long testrunTestcaseGroupTestcaseId) {
        TestrunTestcaseGroupTestcaseDTO testcase = testrunService.selectTestrunTestcaseGroupTestcaseInfo(testrunTestcaseGroupTestcaseId);
        return new TestrunTestcaseGroupTestcaseResponse(testcase);
    }

    @Operation(description = "테스트런 결과 아이템 입력")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}")
    public List<TestrunTestcaseGroupTestcaseItemResponse> updateTestrunResultItems(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @Valid @RequestBody TestrunResultItemsRequest testrunResultItemsRequest) {
        List<TestrunTestcaseGroupTestcaseItemDTO> testrunTestcaseGroupTestcaseItems = testrunResultItemsRequest.toDTO();
        List<TestrunTestcaseGroupTestcaseItemDTO> testrunTestcaseGroupTestcaseItemList = testrunService.updateTestrunTestcaseGroupTestcaseItems(testrunTestcaseGroupTestcaseItems);
        return testrunTestcaseGroupTestcaseItemList.stream().map(TestrunTestcaseGroupTestcaseItemResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "테스트런 결과 아이템 입력 (단건)")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/items/{testcaseTemplateItemId}")
    public TestrunTestcaseGroupTestcaseItemResponse updateTestrunResultItems(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testcaseTemplateItemId, @Valid @RequestBody TestrunTestcaseGroupTestcaseItemRequest testrunTestcaseGroupTestcaseItemRequest) {
        TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItems = testrunTestcaseGroupTestcaseItemRequest.toDTO();
        TestrunTestcaseGroupTestcaseItemDTO testrunTestcaseGroupTestcaseItemList = testrunService.updateTestrunTestcaseGroupTestcaseItem(testrunTestcaseGroupTestcaseItems);
        return new TestrunTestcaseGroupTestcaseItemResponse(testrunTestcaseGroupTestcaseItemList);
    }

    @Operation(description = "테스트런 결과 입력")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/result")
    public Boolean updateTestrunResult(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupTestcaseId, @Valid @RequestBody TestrunResultRequest testrunResultRequest) {
        TestrunStatusDTO testrunStatusDTO = testrunService.updateTestrunTestcaseResult(testrunId, testrunTestcaseGroupTestcaseId, testrunResultRequest.getTestResult());

        MessageData participantData = MessageData.builder().type("TESTRUN-TESTCASE-RESULT-CHANGED").build();
        participantData.addData("testrunTestcaseGroupTestcaseId", testrunTestcaseGroupTestcaseId);
        participantData.addData("testResult", testrunResultRequest.getTestResult());
        messageSendService.sendTo("projects/" + projectId + "/testruns/" + testrunId, participantData);

        MessageData testrunResultChangeData = MessageData.builder().type("TESTRUN-RESULT-CHANGED").build();
        testrunResultChangeData.addData("testrunId", testrunId);
        testrunResultChangeData.addData("testrunStatus", testrunStatusDTO);
        messageSendService.sendTo("projects/" + projectId, testrunResultChangeData);

        if (testrunStatusDTO.isDone()) {
            return true;
        }
        return false;
    }

    @Operation(description = "테스트런 테스트케이스 테스터 변경")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/tester")
    public ResponseEntity<HttpStatus> updateTestrunResult(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupTestcaseId, @Valid @RequestBody TestrunTesterRequest testrunTesterRequest) {
        testrunService.updateTestrunTestcaseTester(spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId, testrunTesterRequest.getTesterId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트런 코멘트 입력")
    @PutMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/comments")
    public TestrunTestcaseGroupTestcaseCommentResponse updateTestrunComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @Valid @RequestBody TestrunTestcaseGroupTestcaseCommentRequest testrunTestcaseGroupTestcaseCommentRequest) {
        TestrunTestcaseGroupTestcaseCommentDTO result = testrunService.updateTestrunTestcaseGroupTestcaseComment(testrunTestcaseGroupTestcaseCommentRequest.toDTO());
        return new TestrunTestcaseGroupTestcaseCommentResponse(result);
    }

    @Operation(description = "테스트런 코멘트 입력")
    @DeleteMapping("/{testrunId}/groups/{testrunTestcaseGroupId}/testcases/{testrunTestcaseGroupTestcaseId}/comments/{testrunTestcaseGroupTestcaseCommentId}")
    public ResponseEntity<HttpStatus> updateTestrunComment(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long testrunId, @PathVariable long testrunTestcaseGroupTestcaseCommentId) {
        testrunService.deleteTestrunTestcaseGroupTestcaseComment(testrunTestcaseGroupTestcaseCommentId);
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
    public List<TestrunListResponse> selectTestrunHistoryList(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam(value = "start") LocalDateTime start, @RequestParam(value = "end") LocalDateTime end) {
        List<TestrunDTO> testruns = testrunService.selectProjectTestrunHistoryList(spaceCode, projectId, start, end);
        return testruns.stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }

    @PostMapping("/{testrunId}/images")
    public ProjectFileResponse createTestrunImage(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testrunId, @RequestParam("file") MultipartFile file, @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {

        String path = projectFileService.createImage(projectId, file);

        ProjectFileDTO fileInfo = ProjectFileDTO.builder().project(ProjectDTO.builder().id(projectId).build()).name(name).size(size).type(type).path(path).uuid(UUID.randomUUID().toString()).fileSourceType(FileSourceTypeCode.TESTRUN).fileSourceId(testrunId).build();

        ProjectFileDTO projectFile = projectFileService.createProjectFile(fileInfo);
        return new ProjectFileResponse(projectFile, spaceCode, projectId);
    }


}

