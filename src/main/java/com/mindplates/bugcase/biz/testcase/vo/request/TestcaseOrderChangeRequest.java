package com.mindplates.bugcase.biz.testcase.vo.request;

import lombok.Data;

@Data
public class TestcaseOrderChangeRequest {

    private Long targetId;
    private Long destinationId;
}
