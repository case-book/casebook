package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.testrun.dto.TestrunIterationDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunIterationService;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunIterationRequest;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunIterationListResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunIterationResponse;
import com.mindplates.bugcase.common.exception.ServiceException;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
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

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testruns/iterations")
@AllArgsConstructor
public class TestrunIterationController {


    private final TestrunIterationService testrunIterationService;

    @Operation(description = "반복 테스트런 목록 조회")
    @GetMapping("")
    public List<TestrunIterationListResponse> selectTestrunIterationList(@PathVariable String spaceCode, @PathVariable long projectId,
        @RequestParam(value = "expired") Boolean expired) {
        List<TestrunIterationDTO> testrunIterationList = testrunIterationService.selectProjectTestrunIterationList(spaceCode, projectId, expired);
        return testrunIterationList.stream().map(TestrunIterationListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "반복 테스트런 생성")
    @PostMapping("")
    public TestrunIterationListResponse createTestrunIterationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @Valid @RequestBody TestrunIterationRequest testrunIterationRequest) {

        if (!testrunIterationRequest.getProjectId().equals(projectId)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        TestrunIterationDTO testrunIteration = testrunIterationRequest.toDTO();
        TestrunIterationDTO createdTestrunIteration = testrunIterationService.createTestrunIterationInfo(testrunIteration);

        return new TestrunIterationListResponse(createdTestrunIteration);
    }


    @Operation(description = "반복 테스트런 변경")
    @PutMapping("/{testrunId}")
    public ResponseEntity<HttpStatus> updateTestrunIterationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @Valid @RequestBody TestrunIterationRequest testrunIterationRequest) {
        TestrunIterationDTO testrunIterationDTO = testrunIterationRequest.toDTO();

        int testcaseCount = testrunIterationDTO.getTestcaseGroups().stream()
            .map(testrunTestcaseGroup -> testrunTestcaseGroup.getTestcases() != null ? testrunTestcaseGroup.getTestcases().size() : 0)
            .reduce(0, Integer::sum);

        if (testcaseCount < 1) {
            throw new ServiceException("testrun.reservation.testcase.empty");
        }

        testrunIterationService.updateTestrunIterationInfo(spaceCode, testrunIterationDTO, false);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "반복 테스트런 상세 조회")
    @GetMapping("/{testrunIterationId}")
    public TestrunIterationResponse selectTestrunIterationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @PathVariable long testrunIterationId) {
        TestrunIterationDTO testrunIteration = testrunIterationService.selectTestrunIterationInfo(testrunIterationId);
        return new TestrunIterationResponse(testrunIteration);
    }


    @Operation(description = "반복 테스트런 삭제")
    @DeleteMapping("/{testrunIterationId}")
    public ResponseEntity<HttpStatus> deleteTestrunIterationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @PathVariable long testrunIterationId) {
        testrunIterationService.deleteProjectTestrunIterationInfo(spaceCode, projectId, testrunIterationId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}

