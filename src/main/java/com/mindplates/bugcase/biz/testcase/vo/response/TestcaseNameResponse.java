package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseNameDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TestcaseNameResponse {

    private Long id;
    private String seqId;
    private String name;


    public TestcaseNameResponse(TestcaseNameDTO testcase) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        this.name = testcase.getName();

    }

    public TestcaseNameResponse(TestcaseDTO testcase) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        this.name = testcase.getName();
    }


}
