package com.mindplates.bugcase.biz.testrun.controller;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.testrun.vo.response.TestrunListResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/testruns")
@AllArgsConstructor
public class TestrunController {

    private final TestrunService testrunService;

    @Operation(description = "프로젝트 테스트런 목록 조회")
    @GetMapping("")
    public List<TestrunListResponse> selectTestrunList(@PathVariable String spaceCode, @PathVariable long projectId) {
        List<Testrun> testruns = testrunService.selectProjectTestrunList(projectId);
        return testruns.stream().map(TestrunListResponse::new).collect(Collectors.toList());
    }


}
