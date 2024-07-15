package com.mindplates.bugcase.biz.testcase.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseNameDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseSimpleDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.service.TestcaseCachedService;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseCreateRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseGroupNameChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseGroupOrderChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseGroupRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseGroupUpdateRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseItemRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseNameChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseNameDescriptionChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseOrderChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseReleaseChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseTestcaseGroupChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseUpdateRequest;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseItemResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseNameResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseListResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestrunTestcaseGroupTestcaseResultResponse;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.util.MappingUtil;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
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
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testcases")
@AllArgsConstructor
public class TestcaseController {

    private final TestcaseService testcaseService;
    private final TestcaseCachedService testcaseCachedService;
    private final TestrunService testrunService;
    private final MappingUtil mappingUtil;
    private final ProjectFileService projectFileService;

    @Operation(description = "테스트케이스 ID, SEQ, 이름 조회")
    @GetMapping("")
    public List<TestcaseNameResponse> selectProjectTestcaseNameList(@PathVariable String spaceCode, @PathVariable Long projectId) {
        List<TestcaseNameDTO> testcaseList = testcaseService.selectProjectTestcaseNameList(projectId);
        return testcaseList.stream().map((TestcaseNameResponse::new)).collect(Collectors.toList());
    }

    @Operation(description = "테스트케이스 그룹 목록 조회")
    @GetMapping("/groups")
    public List<TestcaseGroupResponse> selectProjectTestcaseGroupList(@PathVariable String spaceCode, @PathVariable Long projectId) {
        List<TestcaseGroupDTO> testcaseGroupList = testcaseCachedService.selectTestcaseGroupList(projectId);
        return testcaseGroupList.stream().map(TestcaseGroupResponse::new).collect(Collectors.toList());
    }


    @Operation(description = "테스트케이스 그룹 생성")
    @PostMapping("/groups")
    public TestcaseGroupResponse updateProjectTestcaseGroupOrderInfo(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseGroupRequest testcaseGroupRequest) {
        TestcaseGroupDTO testcaseGroup = testcaseService.createTestcaseGroupInfo(spaceCode, projectId, testcaseGroupRequest.toDTO(projectId));
        return new TestcaseGroupResponse(testcaseGroup);
    }

    @Operation(description = "테스트케이스 그룹 이름 변경")
    @PutMapping("/groups/{groupId}/name")
    public TestcaseGroupResponse updateTestcaseGroupName(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseGroupNameChangeRequest testcaseGroupNameChangeRequest) {
        TestcaseGroupDTO testcaseGroup = testcaseService.updateTestcaseGroupName(spaceCode, projectId, groupId, testcaseGroupNameChangeRequest.getName());
        return new TestcaseGroupResponse(testcaseGroup);
    }

    @Operation(description = "테스트케이스 그룹 정보 변경")
    @PutMapping("/groups/{groupId}")
    public TestcaseGroupResponse updateTestcaseGroupInfo(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseGroupUpdateRequest testcaseGroupUpdateRequest) {
        TestcaseGroupDTO testcaseGroup = testcaseService.updateTestcaseGroupInfo(spaceCode, projectId, groupId, testcaseGroupUpdateRequest.toDTO());
        return new TestcaseGroupResponse(testcaseGroup);
    }

    @Operation(description = "테스트케이스 그룹 위치 변경")
    @PutMapping("/orders")
    public ResponseEntity<HttpStatus> updateProjectTestcaseGroupOrderInfo(@PathVariable String spaceCode, @PathVariable Long projectId,
        @Valid @RequestBody TestcaseGroupOrderChangeRequest testcaseGroupOrderChangeRequest) {
        testcaseService.updateProjectTestcaseGroupOrderInfo(spaceCode, projectId, testcaseGroupOrderChangeRequest.getTargetId(), testcaseGroupOrderChangeRequest.getDestinationId(), testcaseGroupOrderChangeRequest.isToChildren());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스가 속한 그룹 변경")
    @PutMapping("/{testcaseId}/group")
    public ResponseEntity<HttpStatus> updateTestcaseTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseTestcaseGroupChangeRequest testcaseTestcaseGroupChangeRequest) {
        testcaseService.updateTestcaseTestcaseGroupInfo(spaceCode, projectId, testcaseTestcaseGroupChangeRequest.getTargetId(), testcaseTestcaseGroupChangeRequest.getDestinationId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 그룹 삭제")
    @DeleteMapping("/groups/{groupId}")
    public ResponseEntity<HttpStatus> deleteTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId) {
        testcaseService.deleteTestcaseGroupInfo(spaceCode, projectId, groupId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 생성")
    @PostMapping("/groups/{groupId}/cases")
    public TestcaseListResponse createTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId,
        @Valid @RequestBody TestcaseCreateRequest testcaseCreateRequest) {
        TestcaseDTO testcase = testcaseCreateRequest.toDTO(projectId, groupId);
        TestcaseDTO result = testcaseService.createTestcaseInfo(spaceCode, projectId, testcase);
        return new TestcaseListResponse(result);
    }

    @Operation(description = "테스트케이스 위치 변경")
    @PutMapping("/{testcaseId}/order")
    public ResponseEntity<HttpStatus> updateTestcaseOrder(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseOrderChangeRequest testcaseOrderChangeRequest) {
        testcaseService.updateTestcaseOrderInfo(spaceCode, projectId, testcaseOrderChangeRequest.getTargetId(), testcaseOrderChangeRequest.getDestinationId());
        return new ResponseEntity<>(HttpStatus.OK);
    }


































    @Operation(description = "테스트케이스 삭제")
    @DeleteMapping("/{testcaseId}")
    public ResponseEntity<HttpStatus> deleteTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId) {
        testcaseService.deleteTestcaseInfo(spaceCode, projectId, testcaseId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 이름 변경")
    @PutMapping("/{testcaseId}/name")
    public TestcaseListResponse updateTestcaseName(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId,
        @Valid @RequestBody TestcaseNameChangeRequest testcaseNameChangeRequest) {
        TestcaseSimpleDTO testcase = testcaseService.updateTestcaseName(spaceCode, projectId, testcaseId, testcaseNameChangeRequest.getName());
        return new TestcaseListResponse(testcase);
    }

    @Operation(description = "테스트케이스 이름 및 설명 변경")
    @PutMapping("/{testcaseId}/info")
    public TestcaseListResponse updateTestcaseNameAndDescription(@PathVariable String spaceCode, @PathVariable Long projectId,
        @PathVariable Long testcaseId, @Valid @RequestBody TestcaseNameDescriptionChangeRequest testcaseNameDescriptionChangeRequest) {
        TestcaseSimpleDTO testcase = testcaseService
            .updateTestcaseNameAndDescription(spaceCode, projectId, testcaseId, testcaseNameDescriptionChangeRequest.getName(),
                testcaseNameDescriptionChangeRequest.getDescription());
        return new TestcaseListResponse(testcase);
    }

    @Operation(description = "테스트케이스 상세 조회")
    @GetMapping("/{testcaseId}")
    public TestcaseResponse selectTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId) {
        TestcaseDTO testcase = testcaseCachedService.selectTestcaseInfo(projectId, testcaseId);
        return new TestcaseResponse(testcase);
    }

    @Operation(description = "테스트케이스 변경")
    @PutMapping("/{testcaseId}")
    public TestcaseResponse updateTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId,
        @Valid @RequestBody TestcaseUpdateRequest testcaseUpdateRequest) {
        Testcase testcase = testcaseUpdateRequest.buildEntity();
        return new TestcaseResponse(testcaseService.updateTestcaseInfo(spaceCode, projectId, testcase));
    }

    @Operation(description = "테스트케이스 아이템 변경")
    @PutMapping("/{testcaseId}/items/{testcaseItemId}")
    public TestcaseItemResponse updateTestcaseItem(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @PathVariable Long testcaseItemId,
        @Valid @RequestBody TestcaseItemRequest testcaseItemRequest) {

        TestcaseItem testcaseItem = testcaseItemRequest.buildEntity();
        return new TestcaseItemResponse(testcaseService.updateTestcaseItem(spaceCode, projectId, testcaseItem));
    }

    @PostMapping("/{testcaseId}/images")
    public ProjectFileResponse createTestcaseItemImage(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @RequestParam("file") MultipartFile file,
        @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {
        ProjectFileDTO projectFile = new ProjectFileDTO(projectId, name, size, type, UUID.randomUUID().toString(), FileSourceTypeCode.TESTCASE, file);
        projectFile.setFileSourceId(testcaseId);
        ProjectFileDTO result = projectFileService.createProjectFile(projectFile);
        return new ProjectFileResponse(result, spaceCode, projectId);
    }

    @Operation(description = "테스트케이스 복사")
    @PostMapping("/{testcaseId}/copy")
    public TestcaseListResponse copyTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId,
        @RequestParam(value = "targetType") String targetType, @RequestParam(value = "targetId") Long targetId) {
        TestcaseDTO result = testcaseService.copyTestcaseInfo(spaceCode, projectId, testcaseId, targetType, targetId);
        return new TestcaseListResponse(result);
    }

    @Operation(description = "테스트케이스 그룹 복사")
    @PostMapping("/groups/{testcaseGroupId}/copy")
    public TestcaseGroupResponse copyTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseGroupId,
        @RequestParam(value = "targetType") String targetType, @RequestParam(value = "targetId") Long targetId) {
        TestcaseGroupDTO result = testcaseService.copyTestcaseGroupInfo(spaceCode, projectId, testcaseGroupId, targetType, targetId);
        return new TestcaseGroupResponse(result);
    }


    @Operation(description = "테스트케이스 릴리스 변경")
    @PutMapping("/{testcaseId}/release")
    public TestcaseListResponse updateTestcaseRelease(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId,
        @Valid @RequestBody TestcaseReleaseChangeRequest testcaseReleaseChangeRequest) {
        TestcaseSimpleDTO testcase = testcaseService
            .createTestcaseRelease(spaceCode, projectId, testcaseId, testcaseReleaseChangeRequest.getProjectReleaseId());
        return new TestcaseListResponse(testcase);
    }

    @Operation(description = "테스트케이스 테스트런 결과 히스토리")
    @GetMapping("/{testcaseId}/testrun/result/history")
    public List<TestrunTestcaseGroupTestcaseResultResponse> selectTestcaseTestrunHistory(@PathVariable String spaceCode, @PathVariable Long projectId,
        @PathVariable Long testcaseId, @RequestParam(required = false) Integer pageNo, @RequestParam(required = false) Long currentTestrunId) {
        List<TestrunTestcaseGroupTestcaseDTO> list = testrunService.selectTestcaseTestrunResultHistory(spaceCode, projectId, testcaseId, currentTestrunId, pageNo);

        return list.stream().map(TestrunTestcaseGroupTestcaseResultResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "테스트케이스 AI 재구성")
    @PostMapping("/{testcaseId}/paraphrase")
    public Mono<JsonNode> createParaphraseTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @RequestParam(value = "modelId") long modelId)
        throws JsonProcessingException {
        return testcaseService.createParaphraseTestcase(spaceCode, projectId, testcaseId, modelId);
    }
}
