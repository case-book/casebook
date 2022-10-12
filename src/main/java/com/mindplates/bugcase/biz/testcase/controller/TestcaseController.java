package com.mindplates.bugcase.biz.testcase.controller;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testcase.vo.request.*;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseSimpleResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseTemplateResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.vo.UserSession;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testcases")
@AllArgsConstructor
public class TestcaseController {

    private final ProjectService projectService;

    private final TestcaseService testcaseService;


    @Operation(description = "프로젝트 테스트케이스 설정 조회")
    @GetMapping("/templates")
    public List<TestcaseTemplateResponse> selectSpaceProjectSpaceList(@PathVariable String spaceCode, @PathVariable Long projectId) {
        List<TestcaseTemplate> testcaseTemplates = testcaseService.selectTestcaseTemplateItemList(projectId);
        return testcaseTemplates.stream().map(TestcaseTemplateResponse::new).collect(Collectors.toList());
    }


    @Operation(description = "테스트케이스 설정 수정")
    @PutMapping("/config")
    public ResponseEntity<Resource> updateTestcaseConfig(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseConfigRequest testcaseConfigRequest, @ApiIgnore UserSession userSession) {

        Optional<Project> projectInfo = projectService.selectProjectInfo(spaceCode, projectId);

        testcaseService.saveTestcaseTemplateItemList(spaceCode, projectId, testcaseConfigRequest.buildEntity(projectId), userSession.getId());

        if (!projectInfo.isPresent()) {
            throw new ServiceException(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok().build();
    }

    @Operation(description = "테스트케이스 그룹 생성")
    @PostMapping("/groups")
    public TestcaseGroupResponse createTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseGroupRequest testcaseGroupRequest, @ApiIgnore UserSession userSession) {

        Optional<Project> projectInfo = projectService.selectProjectInfo(spaceCode, projectId);

        if (!projectInfo.isPresent()) {
            throw new ServiceException(HttpStatus.NOT_FOUND);
        }

        TestcaseGroup testcaseGroup = testcaseService.createTestcaseGroupInfo(spaceCode, projectId, testcaseGroupRequest.buildEntity(projectId), userSession.getId());

        return new TestcaseGroupResponse(testcaseGroup);
    }

    @Operation(description = "테스트케이스 그룹 위치 변경")
    @PutMapping("/orders")
    public ResponseEntity createTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseGroupOrderChangeRequest testcaseGroupOrderChangeRequest) {
        testcaseService.updateProjectTestcaseGroupOrderInfo(spaceCode, projectId, testcaseGroupOrderChangeRequest.getTargetId(), testcaseGroupOrderChangeRequest.getDestinationId(), testcaseGroupOrderChangeRequest.isToChildren());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 그룹 삭제")
    @DeleteMapping("/groups/{groupId}")
    public ResponseEntity deleteTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId) {
        testcaseService.deleteTestcaseGroupInfo(spaceCode, projectId, groupId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 그룹 이름 변경")
    @PutMapping("/groups/{groupId}/name")
    public TestcaseGroupResponse updateTestcaseGroupName(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseGroupNameChangeRequest testcaseGroupNameChangeRequest) {
        TestcaseGroup testcaseGroup = testcaseService.updateTestcaseGroupName(spaceCode, projectId, groupId, testcaseGroupNameChangeRequest.getName());
        return new TestcaseGroupResponse(testcaseGroup);
    }

    @Operation(description = "테스트케이스 생성")
    @PostMapping("/groups/{groupId}/cases")
    public TestcaseSimpleResponse createTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseCreateRequest testcaseCreateRequest) {
        Testcase testcase = testcaseCreateRequest.buildEntity();
        testcase.setTestcaseGroup(TestcaseGroup.builder().id(groupId).build()); // 보안 구멍
        Testcase result = testcaseService.createTestcaseInfo(spaceCode, projectId, testcase);
        return new TestcaseSimpleResponse(result);
    }

    @Operation(description = "테스트케이스 그룹 변경")
    @PutMapping("/{testcaseId}/group")
    public ResponseEntity updateTestcaseTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseTestcaseGroupChangeRequest testcaseTestcaseGroupChangeRequest) {

        testcaseService.updateTestcaseTestcaseGroupInfo(spaceCode, projectId, testcaseTestcaseGroupChangeRequest.getTargetId(), testcaseTestcaseGroupChangeRequest.getDestinationId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 위치 변경")
    @PutMapping("/{testcaseId}/order")
    public ResponseEntity updateTestcaseOrder(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseOrderChangeRequest testcaseOrderChangeRequest) {

        testcaseService.updateTestcaseOrderInfo(spaceCode, projectId, testcaseOrderChangeRequest.getTargetId(), testcaseOrderChangeRequest.getDestinationId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 삭제")
    @DeleteMapping("/{testcaseId}")
    public ResponseEntity deleteTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId) {
        testcaseService.deleteTestcaseInfo(spaceCode, projectId, testcaseId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 이름 변경")
    @PutMapping("/{testcaseId}/name")
    public TestcaseResponse updateTestcaseName(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseNameChangeRequest testcaseNameChangeRequest) {
        Testcase testcase = testcaseService.updateTestcaseName(spaceCode, projectId, testcaseId, testcaseNameChangeRequest.getName());
        return new TestcaseResponse(testcase);
    }


}
