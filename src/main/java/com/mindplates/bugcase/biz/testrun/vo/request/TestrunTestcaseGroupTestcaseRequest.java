package com.mindplates.bugcase.biz.testrun.vo.request;

import lombok.Data;

@Data
public class TestrunTestcaseGroupTestcaseRequest {

    private Long id;

    private Long testrunTestcaseGroupId;

    private Long testcaseId;


}
