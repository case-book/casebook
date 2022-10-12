package com.mindplates.bugcase.biz.testcase.vo.request;

import lombok.Data;

@Data
public class TestcaseTestcaseGroupChangeRequest {
    private Long targetId;
    private Long destinationId;
}
