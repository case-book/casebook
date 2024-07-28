package com.mindplates.bugcase.biz.testrun.vo.request;

import java.util.List;
import lombok.Data;

@Data
public class TestrunTestcaseGroupRequest {

    private Long id;

    private Long testrunId;

    private Long testcaseGroupId;

    private List<TestrunTestcaseGroupTestcaseRequest> testcases;


}
