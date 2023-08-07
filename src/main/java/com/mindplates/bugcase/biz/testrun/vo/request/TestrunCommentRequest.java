package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testrun.dto.TestrunCommentDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import lombok.Data;

@Data
public class TestrunCommentRequest {

    private Long id;

    private Long testrunId;

    private String comment;

    public TestrunCommentDTO toDTO() {

        return TestrunCommentDTO.builder().id(id).testrun(TestrunDTO.builder().id(testrunId).build()).comment(comment).build();

    }

}
