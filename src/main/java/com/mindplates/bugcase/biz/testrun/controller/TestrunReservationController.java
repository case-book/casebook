package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.testrun.dto.TestrunReservationDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.testrun.vo.request.TestrunReservationRequest;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunReservationListResponse;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunReservationResponse;
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
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testruns/reservations")
@AllArgsConstructor
public class TestrunReservationController {

    private final TestrunService testrunService;

    @Operation(description = "예약 테스트런 목록 조회")
    @GetMapping("")
    public List<TestrunReservationListResponse> selectTestrunReservationList(@PathVariable String spaceCode, @PathVariable long projectId, @RequestParam(value = "expired") Boolean expired) {
        List<TestrunReservationDTO> testrunReservationList = testrunService.selectProjectReserveTestrunList(spaceCode, projectId, expired);
        return testrunReservationList.stream().map(TestrunReservationListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "예약 테스트런 생성")
    @PostMapping("")
    public TestrunReservationListResponse createTestrunReservationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @Valid @RequestBody TestrunReservationRequest testrunReservationRequest) {

        if (!testrunReservationRequest.getProjectId().equals(projectId)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        TestrunReservationDTO testrunReservation = testrunReservationRequest.buildEntity();
        TestrunReservationDTO createdTestrunReservation = testrunService.createTestrunReservationInfo(spaceCode, testrunReservation);

        return new TestrunReservationListResponse(createdTestrunReservation);
    }


    @Operation(description = "예약 테스트런 변경")
    @PutMapping("/{testrunId}")
    public ResponseEntity<HttpStatus> updateTestrunReservationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @Valid @RequestBody TestrunReservationRequest testrunReservationRequest) {
        TestrunReservationDTO testrunReservation = testrunReservationRequest.buildEntity();
        testrunService.updateTestrunReservationInfo(spaceCode, testrunReservation);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(description = "예약 테스트런 상세 조회")
    @GetMapping("/{testrunReservationId}")
    public TestrunReservationResponse selectTestrunReservationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @PathVariable long testrunReservationId) {
        TestrunReservationDTO testrunReservation = testrunService.selectProjectTestrunReservationInfo(testrunReservationId);
        return new TestrunReservationResponse(testrunReservation);
    }

    @Operation(description = "예약 테스트런 삭제")
    @DeleteMapping("/{testrunReservationId}")
    public ResponseEntity<HttpStatus> deleteTestrunReservationInfo(@PathVariable String spaceCode, @PathVariable long projectId,
        @PathVariable long testrunReservationId) {
        testrunService.deleteProjectTestrunReservationInfo(spaceCode, projectId, testrunReservationId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}

