package com.mindplates.bugcase.biz.testcase.controller;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseConfigRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseGroupOrderChangeRequest;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseGroupRequest;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseGroupResponse;
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
    public ProjectResponse createTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @Valid @RequestBody TestcaseGroupOrderChangeRequest testcaseGroupOrderChangeRequest) {
        Project project = testcaseService.updateProjectTestcaseGroupOrderInfo(spaceCode, projectId, testcaseGroupOrderChangeRequest.getTargetId(), testcaseGroupOrderChangeRequest.getDestinationId(), testcaseGroupOrderChangeRequest.isToChildren());
        return new ProjectResponse(project);
    }

    @Operation(description = "테스트케이스 그룹 삭제")
    @DeleteMapping("/groups/{groupId}")
    public ResponseEntity deleteTestcaseGroup(@PathVariable String spaceCode, @PathVariable Long projectId, @PathVariable Long groupId) {
        testcaseService.deleteTestcaseGroupInfo(spaceCode, projectId, groupId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
