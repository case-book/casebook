package com.mindplates.bugcase.biz.automation.controller;

import com.mindplates.bugcase.biz.automation.request.AutomationTestcaseGroupRequest;
import com.mindplates.bugcase.biz.automation.request.AutomationTestcaseItemRequest;
import com.mindplates.bugcase.biz.automation.request.AutomationTestcaseRequest;
import com.mindplates.bugcase.biz.automation.request.TestResultRequest;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseListResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateResponse;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.common.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import java.util.Collections;
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
@RequestMapping("/api/automation/projects/{projectToken}")
@AllArgsConstructor
public class AutomationController {

    private final TestrunService testrunService;
    private final TestcaseService testcaseService;
    private final ProjectService projectService;
    private final SpaceService spaceService;

    @Operation(description = "API 이용하여 테스트런 결과를 등록합니다.")
    @PostMapping("/testruns/{testrunSeqNumber}/testcases/{testcaseSeqNumber}")
    public ResponseEntity<HttpStatus> createTestrunResult(
        @PathVariable String projectToken,
        @PathVariable long testrunSeqNumber,
        @PathVariable long testcaseSeqNumber,
        @Valid @RequestBody TestResultRequest testResultRequest) {

        Long userId = SessionUtil.getUserId(false);
        Long projectId = projectService.selectProjectId(projectToken);
        String spaceCode = spaceService.selectSpaceCodeByProjectId(projectId);
        testrunService.updateTestrunTestcaseResult(spaceCode, projectId, projectToken, testrunSeqNumber, testcaseSeqNumber, testResultRequest.getResult(), testResultRequest.getComment(), userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스가 포함된 테스트런 목록을 조회합니다.")
    @GetMapping("/testcases/{testcaseSeqNumber}/testruns")
    public List<Long> selectTestcaseIncludeTestrunList(@PathVariable String projectToken, @PathVariable Long testcaseSeqNumber) {
        return testrunService.selectTestcaseIncludeTestrunList(projectToken, testcaseSeqNumber);
    }

    @Operation(description = "프로젝트의 테스트케이스 목록을 조회합니다.")
    @GetMapping("/testcases")
    public List<TestcaseListResponse> selectProjectTestcaseList(@PathVariable String projectToken) {
        Long projectId = projectService.selectProjectId(projectToken);
        List<TestcaseDTO> testcaseList = testcaseService.selectProjectTestcaseList(projectId);
        return testcaseList.stream().map(TestcaseListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "테스트케이스 상세 정보를 조회합니다.")
    @GetMapping("/testcases/{testcaseSeqNumber}")
    public TestcaseResponse selectProjectTestcase(@PathVariable String projectToken, @PathVariable Long testcaseSeqNumber) {
        Long projectId = projectService.selectProjectId(projectToken);
        TestcaseDTO testcase = testcaseService.selectTestcaseInfoBySeqId(projectId, "TC" + testcaseSeqNumber);
        return new TestcaseResponse(testcase, null, null);
    }

    @Operation(description = "테스트케이스를 생성합니다. 테스트케이스 아이템 정보를 포함하여 생성할 수 있습니다.")
    @PostMapping("/testcases")
    public TestcaseResponse createProjectTestcase(@PathVariable String projectToken, @Valid @RequestBody AutomationTestcaseRequest request) {
        Long projectId = projectService.selectProjectId(projectToken);
        String spaceCode = spaceService.selectSpaceCodeByProjectId(projectId);
        TestcaseDTO testcase = testcaseService.createTestcaseBySeqId(
            spaceCode, projectId,
            "G" + request.getTestcaseGroupSeqNumber(),
            request.getName(),
            request.getDescription(),
            request.getTesterType(),
            request.getTesterValue(),
            toTestcaseItemDTOList(request.getTestcaseItems()));
        return new TestcaseResponse(testcaseService.selectTestcaseInfoBySeqId(projectId, testcase.getSeqId()), null, null);
    }

    @Operation(description = "테스트케이스 정보를 변경합니다. 테스트케이스 아이템 정보를 포함하여 변경할 수 있습니다.")
    @PutMapping("/testcases/{testcaseSeqNumber}")
    public TestcaseResponse updateProjectTestcase(@PathVariable String projectToken, @PathVariable Long testcaseSeqNumber,
        @Valid @RequestBody AutomationTestcaseRequest request) {
        Long projectId = projectService.selectProjectId(projectToken);
        String spaceCode = spaceService.selectSpaceCodeByProjectId(projectId);
        TestcaseDTO testcase = testcaseService.updateTestcaseInfoBySeqId(
            spaceCode, projectId,
            "TC" + testcaseSeqNumber,
            request.getName(),
            request.getDescription(),
            request.getTesterType(),
            request.getTesterValue(),
            request.getClosed(),
            toTestcaseItemDTOList(request.getTestcaseItems()));
        return new TestcaseResponse(testcase, null, null);
    }

    @Operation(description = "테스트케이스를 삭제합니다.")
    @DeleteMapping("/testcases/{testcaseSeqNumber}")
    public ResponseEntity<HttpStatus> deleteProjectTestcase(@PathVariable String projectToken, @PathVariable Long testcaseSeqNumber) {
        Long projectId = projectService.selectProjectId(projectToken);
        String spaceCode = spaceService.selectSpaceCodeByProjectId(projectId);
        testcaseService.deleteTestcaseBySeqId(spaceCode, projectId, "TC" + testcaseSeqNumber);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 그룹을 생성합니다.")
    @PostMapping("/testcase-groups")
    public TestcaseGroupResponse createProjectTestcaseGroup(@PathVariable String projectToken, @Valid @RequestBody AutomationTestcaseGroupRequest request) {
        Long projectId = projectService.selectProjectId(projectToken);
        String spaceCode = spaceService.selectSpaceCodeByProjectId(projectId);
        String parentSeqId = request.getParentSeqNumber() != null ? "G" + request.getParentSeqNumber() : null;
        TestcaseGroupDTO group = testcaseService.createTestcaseGroupBySeqId(spaceCode, projectId, parentSeqId, request.getName(), request.getDescription());
        return new TestcaseGroupResponse(group);
    }

    @Operation(description = "테스트케이스 그룹 정보를 변경합니다.")
    @PutMapping("/testcase-groups/{groupSeqNumber}")
    public TestcaseGroupResponse updateProjectTestcaseGroup(@PathVariable String projectToken, @PathVariable Long groupSeqNumber,
        @Valid @RequestBody AutomationTestcaseGroupRequest request) {
        Long projectId = projectService.selectProjectId(projectToken);
        String spaceCode = spaceService.selectSpaceCodeByProjectId(projectId);
        TestcaseGroupDTO group = testcaseService.updateTestcaseGroupBySeqId(spaceCode, projectId, "G" + groupSeqNumber, request.getName(), request.getDescription());
        return new TestcaseGroupResponse(group);
    }

    @Operation(description = "테스트케이스 그룹을 삭제합니다. 하위 그룹 및 테스트케이스도 함께 삭제됩니다.")
    @DeleteMapping("/testcase-groups/{groupSeqNumber}")
    public ResponseEntity<HttpStatus> deleteProjectTestcaseGroup(@PathVariable String projectToken, @PathVariable Long groupSeqNumber) {
        Long projectId = projectService.selectProjectId(projectToken);
        String spaceCode = spaceService.selectSpaceCodeByProjectId(projectId);
        testcaseService.deleteTestcaseGroupBySeqId(spaceCode, projectId, "G" + groupSeqNumber);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "프로젝트의 테스트케이스 템플릿 목록을 조회합니다. 테스트케이스 생성/변경 시 testcaseTemplateItemId를 확인하기 위해 사용합니다.")
    @GetMapping("/testcase-templates")
    public List<TestcaseTemplateResponse> selectProjectTestcaseTemplateList(@PathVariable String projectToken) {
        Long projectId = projectService.selectProjectId(projectToken);
        List<TestcaseTemplateDTO> templates = projectService.selectProjectTestcaseTemplateList(projectId);
        return templates.stream().map(TestcaseTemplateResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "프로젝트의 특정 테스트케이스 템플릿 상세 정보를 조회합니다.")
    @GetMapping("/testcase-templates/{testcaseTemplateId}")
    public TestcaseTemplateResponse selectProjectTestcaseTemplate(@PathVariable String projectToken, @PathVariable Long testcaseTemplateId) {
        Long projectId = projectService.selectProjectId(projectToken);
        TestcaseTemplateDTO template = projectService.selectProjectTestcaseTemplateInfo(projectId, testcaseTemplateId);
        return new TestcaseTemplateResponse(template);
    }

    private List<TestcaseItemDTO> toTestcaseItemDTOList(List<AutomationTestcaseItemRequest> items) {
        if (items == null) {
            return null;
        }
        if (items.isEmpty()) {
            return Collections.emptyList();
        }
        return items.stream().map(item -> TestcaseItemDTO.builder()
            .testcaseTemplateItem(TestcaseTemplateItemDTO.builder().id(item.getTestcaseTemplateItemId()).build())
            .type(item.getType())
            .value(item.getValue())
            .text(item.getText())
            .build()).collect(Collectors.toList());
    }

}
