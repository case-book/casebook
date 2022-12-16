package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
import lombok.Data;

@Data
public class TestrunTestcaseGroupTestcaseCommentRequest {

    private Long id;

    private Long testrunTestcaseGroupTestcaseId;

    private String comment;

    public TestrunTestcaseGroupTestcaseComment buildEntity() {

        return TestrunTestcaseGroupTestcaseComment.builder()
                .id(id)
                .testrunTestcaseGroupTestcase(TestrunTestcaseGroupTestcase.builder().id(testrunTestcaseGroupTestcaseId).build())
                .comment(comment)
                .build();
    }


}
