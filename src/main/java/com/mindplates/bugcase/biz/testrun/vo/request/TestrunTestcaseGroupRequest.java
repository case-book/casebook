package com.mindplates.bugcase.biz.testrun.vo.request;

import lombok.Data;

import java.util.List;

@Data
public class TestrunTestcaseGroupRequest {

    private Long id;

    private Long testrunId;

    private Long testcaseGroupId;

    private List<TestrunTestcaseGroupTestcaseRequest> testcases;


}
