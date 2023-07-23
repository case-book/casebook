package com.mindplates.bugcase.biz.testcase.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.service.ProjectFileService;
import com.mindplates.bugcase.biz.project.vo.response.ProjectFileResponse;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupWithTestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseSimpleDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testcase.vo.request.*;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseResponse;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseSimpleResponse;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.util.MappingUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testcases")
@AllArgsConstructor
public class TestcaseController {

    private final TestcaseService testcaseService;
    private final MappingUtil mappingUtil;
    private final ProjectFileService projectFileService;

    @Operation(description = "테스트케이스 그룹 생성")
    @PostMapping("/groups")
    public TestcaseGroupResponse updateProjectTestcaseGroupOrderInfo(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseGroupRequest testcaseGroupRequest) {
        TestcaseGroupDTO testcaseGroupDTO = mappingUtil.convert(testcaseGroupRequest, TestcaseGroupDTO.class);
        testcaseGroupDTO.setProject(ProjectDTO.builder().id(projectId).build());
        TestcaseGroupWithTestcaseDTO testcaseGroup = testcaseService.createTestcaseGroupInfo(spaceCode, projectId, testcaseGroupDTO);
        return mappingUtil.convert(testcaseGroup, TestcaseGroupResponse.class);
    }

    @Operation(description = "테스트케이스 그룹 이름 변경")
    @PutMapping("/groups/{groupId}/name")
    public TestcaseGroupResponse updateTestcaseGroupName(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseGroupNameChangeRequest testcaseGroupNameChangeRequest) {
        TestcaseGroupWithTestcaseDTO testcaseGroup = testcaseService.updateTestcaseGroupName(spaceCode, projectId, groupId, testcaseGroupNameChangeRequest.getName());
        return mappingUtil.convert(testcaseGroup, TestcaseGroupResponse.class);
    }

    @Operation(description = "테스트케이스 그룹 정보 변경")
    @PutMapping("/groups/{groupId}")
    public TestcaseGroupResponse updateTestcaseGroupInfo(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseGroupUpdateRequest testcaseGroupUpdateRequest) {
        TestcaseGroupWithTestcaseDTO testcaseGroup = testcaseService.updateTestcaseGroupInfo(spaceCode, projectId, groupId, testcaseGroupUpdateRequest.getName(), testcaseGroupUpdateRequest.getDescription());
        return mappingUtil.convert(testcaseGroup, TestcaseGroupResponse.class);
    }

    @Operation(description = "테스트케이스 그룹 위치 변경")
    @PutMapping("/orders")
    public ResponseEntity<HttpStatus> updateProjectTestcaseGroupOrderInfo(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseGroupOrderChangeRequest testcaseGroupOrderChangeRequest) {
        testcaseService.updateProjectTestcaseGroupOrderInfo(spaceCode, projectId, testcaseGroupOrderChangeRequest.getTargetId(), testcaseGroupOrderChangeRequest.getDestinationId(), testcaseGroupOrderChangeRequest.isToChildren());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "테스트케이스 그룹 변경")
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
    public TestcaseSimpleResponse createTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseCreateRequest testcaseCreateRequest) {
        TestcaseDTO testcaseDTO = mappingUtil.convert(testcaseCreateRequest, TestcaseDTO.class);
        testcaseDTO.setTestcaseGroup(TestcaseGroupDTO.builder().id(groupId).build());
        TestcaseDTO result = testcaseService.createTestcaseInfo(spaceCode, projectId, testcaseDTO);
        return new TestcaseSimpleResponse(result);
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
    public TestcaseSimpleResponse updateTestcaseName(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseNameChangeRequest testcaseNameChangeRequest) {
        TestcaseSimpleDTO testcase = testcaseService.updateTestcaseName(spaceCode, projectId, testcaseId, testcaseNameChangeRequest.getName());
        return new TestcaseSimpleResponse(testcase);
    }

    @Operation(description = "테스트케이스 이름 및 설명 변경")
    @PutMapping("/{testcaseId}/info")
    public TestcaseSimpleResponse updateTestcaseNameAndDescription(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseNameDescriptionChangeRequest testcaseNameDescriptionChangeRequest) {
        TestcaseSimpleDTO testcase = testcaseService.updateTestcaseNameAndDescription(spaceCode, projectId, testcaseId, testcaseNameDescriptionChangeRequest.getName(), testcaseNameDescriptionChangeRequest.getDescription());
        return new TestcaseSimpleResponse(testcase);
    }

    @Operation(description = "테스트케이스 상세 조회")
    @GetMapping("/{testcaseId}")
    public TestcaseResponse selectTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId) {
        TestcaseDTO testcase = testcaseService.selectTestcaseInfo(projectId, testcaseId);
        return new TestcaseResponse(testcase);
    }

    @Operation(description = "테스트케이스 변경")
    @PutMapping("/{testcaseId}")
    public TestcaseResponse updateTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseUpdateRequest testcaseUpdateRequest) {
        Testcase testcase = testcaseUpdateRequest.buildEntity();
        return new TestcaseResponse(testcaseService.updateTestcaseInfo(spaceCode, projectId, testcase));
    }

    @PostMapping("/{testcaseId}/images")
    public ProjectFileResponse createTestcaseItemImage(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @RequestParam("file") MultipartFile file, @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type) {
        String path = projectFileService.createImage(projectId, file);
        ProjectFileDTO fileInfo = ProjectFileDTO.builder().project(ProjectDTO.builder().id(projectId).build()).name(name).size(size).type(type).path(path).uuid(UUID.randomUUID().toString()).fileSourceType(FileSourceTypeCode.TESTCASE).fileSourceId(testcaseId).build();
        ProjectFileDTO projectFile = projectFileService.createProjectFile(fileInfo);
        return new ProjectFileResponse(projectFile, spaceCode, projectId);
    }


}
