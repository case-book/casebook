package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseCommentDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import lombok.Data;

@Data
public class TestrunTestcaseGroupTestcaseCommentRequest {

    private Long id;

    private Long testrunTestcaseGroupTestcaseId;

    private String comment;

    public TestrunTestcaseGroupTestcaseCommentDTO toDTO() {

        return TestrunTestcaseGroupTestcaseCommentDTO.builder()
                .id(id)
                .testrunTestcaseGroupTestcase(TestrunTestcaseGroupTestcaseDTO.builder().id(testrunTestcaseGroupTestcaseId).build())
                .comment(comment).build();

    }

}
