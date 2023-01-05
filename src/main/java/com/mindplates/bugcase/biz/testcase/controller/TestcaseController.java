package com.mindplates.bugcase.biz.testcase.controller;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemFileDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.service.TestcaseItemFileService;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testcase.vo.request.*;
import com.mindplates.bugcase.biz.testcase.vo.response.*;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testcases")
@AllArgsConstructor
public class TestcaseController {

    private final TestcaseService testcaseService;
    private final TestcaseItemFileService testcaseItemFileService;
    private final FileUtil fileUtil;

    private final MappingUtil mappingUtil;

    @Operation(description = "프로젝트 테스트케이스 설정 조회")
    @GetMapping("/templates")
    public List<TestcaseTemplateResponse> selectSpaceProjectSpaceList(@PathVariable String spaceCode, @PathVariable Long projectId) {
        List<TestcaseTemplateDTO> testcaseTemplates = testcaseService.selectTestcaseTemplateItemList(projectId);
        return testcaseTemplates.stream().map(TestcaseTemplateResponse::new).collect(Collectors.toList());
    }


    @Operation(description = "테스트케이스 그룹 생성")
    @PostMapping("/groups")
    public TestcaseGroupResponse createTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseGroupRequest testcaseGroupRequest) {
        TestcaseGroupDTO testcaseGroupDTO = mappingUtil.convert(testcaseGroupRequest, TestcaseGroupDTO.class);
        testcaseGroupDTO.setProject(ProjectDTO.builder().id(projectId).build());

        TestcaseGroupDTO testcaseGroup = testcaseService.createTestcaseGroupInfo(spaceCode, projectId, testcaseGroupDTO);
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
        TestcaseGroupDTO testcaseGroup = testcaseService.updateTestcaseGroupName(spaceCode, projectId, groupId, testcaseGroupNameChangeRequest.getName());
        return new TestcaseGroupResponse(testcaseGroup);
    }

    @Operation(description = "테스트케이스 그룹 정보 변경")
    @PutMapping("/groups/{groupId}")
    public TestcaseGroupResponse updateTestcaseGroupInfo(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseGroupUpdateRequest testcaseGroupUpdateRequest) {
        TestcaseGroupDTO testcaseGroup = testcaseService.selectTestcaseGroupInfo(projectId, groupId);
        testcaseService.updateTestcaseGroupInfo(spaceCode, projectId, groupId, testcaseGroupUpdateRequest.getName(), testcaseGroupUpdateRequest.getDescription());
        return new TestcaseGroupResponse(testcaseGroup);
    }

    @Operation(description = "테스트케이스 생성")
    @PostMapping("/groups/{groupId}/cases")
    public TestcaseSimpleResponse createTestcase(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId, @Valid @RequestBody TestcaseCreateRequest testcaseCreateRequest) {
        TestcaseDTO testcaseDTO = mappingUtil.convert(testcaseCreateRequest, TestcaseDTO.class);
        testcaseDTO.setTestcaseGroup(TestcaseGroupDTO.builder().id(groupId).build()); // 보안 구멍
        TestcaseDTO result = testcaseService.createTestcaseInfo(spaceCode, projectId, testcaseDTO);
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
    public TestcaseSimpleResponse updateTestcaseName(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseNameChangeRequest testcaseNameChangeRequest) {
        TestcaseDTO testcase = testcaseService.updateTestcaseName(spaceCode, projectId, testcaseId, testcaseNameChangeRequest.getName());
        return new TestcaseSimpleResponse(testcase);
    }

    @Operation(description = "테스트케이스 이름 및 설명 변경")
    @PutMapping("/{testcaseId}/info")
    public TestcaseSimpleResponse updateTestcaseNameAndDescription(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @Valid @RequestBody TestcaseNameDescriptionChangeRequest testcaseNameDescriptionChangeRequest) {
        TestcaseDTO testcase = testcaseService.updateTestcaseNameAndDescription(spaceCode, projectId, testcaseId, testcaseNameDescriptionChangeRequest.getName(), testcaseNameDescriptionChangeRequest.getDescription());
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
    public TestcaseResponse updateTestcase(@PathVariable String spaceCode,
                                           @PathVariable Long projectId,
                                           @PathVariable Long testcaseId,
                                           @Valid @RequestBody TestcaseUpdateRequest testcaseUpdateRequest) {

        Testcase testcase = testcaseUpdateRequest.buildEntity();
        return new TestcaseResponse(testcaseService.updateTestcaseInfo(spaceCode, projectId, testcase));

    }

    @PostMapping("/{testcaseId}/images")
    public TestcaseItemFileResponse createTestcaseItemImage(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @RequestParam("file") MultipartFile file, @RequestParam("name") String name, @RequestParam("size") Long size, @RequestParam("type") String type,
                                                            HttpServletRequest req) {

        String path = testcaseItemFileService.createImage(projectId, file);

        TestcaseItemFileDTO testcaseItemFile = TestcaseItemFileDTO.builder()
                .project(ProjectDTO.builder().id(projectId).build())
                .testcase(TestcaseDTO.builder().id(testcaseId).build())
                .name(name)
                .size(size)
                .type(type)
                .path(path)
                .uuid(UUID.randomUUID().toString())
                .build();

        TestcaseItemFileDTO projectFile = testcaseItemFileService.createTestcaseItemFile(testcaseItemFile);
        return new TestcaseItemFileResponse(projectFile, spaceCode, projectId, testcaseId);
    }


    @GetMapping("/{testcaseId}/images/{imageId}")
    public ResponseEntity<Resource> selectTestcaseItemImage(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long testcaseId, @PathVariable Long imageId, @RequestParam(value = "uuid") String uuid) {

        TestcaseItemFileDTO testcaseItemFile = testcaseItemFileService.selectTestcaseItemFile(projectId, testcaseId, imageId, uuid);
        Resource resource = fileUtil.loadFileAsResource(testcaseItemFile.getPath());

        ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(testcaseItemFile.getName(), StandardCharsets.UTF_8).build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(resource);
    }


}
