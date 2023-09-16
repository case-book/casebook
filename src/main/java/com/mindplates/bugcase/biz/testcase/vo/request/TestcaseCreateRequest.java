package com.mindplates.bugcase.biz.testcase.vo.request;

import lombok.Data;

@Data
public class TestcaseCreateRequest {

    private Long id;
    private Long testcaseGroupId;
    private String name;
    private Integer itemOrder;

}
